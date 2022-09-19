const { fork } = require( "child_process" );

const path = require( "path" );
const fs = require( "fs" );

const argv = require( "minimist" )( process.argv.slice( 2 ) );

const colors = require( "colors/safe" );

const commander = require( "commander" );
const StellarSDK = require( "stellar-sdk" );

const isSubprocess = typeof process.send !== "undefined";

const CWD = process.cwd();

const search = ( address, position, offset = 0 ) => {

    try {

        let regex;

        if( offset > 0 ) {

            switch( position )
                {
        
                    case "start":
                        regex = new RegExp( `^\\S{${offset}}${address}`, "i" );
                        break;
        
                    case "end":
                        regex = new RegExp( `${address}\\S{${offset}}$`, "i" );
                        break;
        
                    case "any":
                        regex = new RegExp( address, "gi" );
                        break;

                    default:
                        regex = new RegExp( `^\\S{${offset}}${address}`, "i" );
                        break;
        
                }

        } else {

            switch( position )
                {
        
                    case "start":
                        regex = new RegExp( `^${address}`, "i" );
                        break;
        
                    case "end":
                        regex = new RegExp( `${address}$`, "i" );
                        break;
        
                    case "any":
                        regex = new RegExp( address, "gi" );
                        break;
        
                    default:
                        regex = new RegExp( `${address}`, "i" );
                        break;
        
                }

        }

        let counter = 0;
        let result;
        let pair;
        let publicKey;
    
        while( !result ) {
    
            if( counter % 1000 === 0 ) {
    
                process.send({ counter: 1000 });
    
            }
    
            pair = StellarSDK.Keypair.random();

            publicKey = pair.publicKey();
    
            result = regex.test( String( publicKey ) );
    
            counter++;
    
        }
    
        if( result ) {
            process.send({ address: publicKey, privateKey: pair.secret() });
        }

    } catch( err ) {

        console.log( colors.red( err ) );

        process.exit( 0 );

    }

}

const progress = ( counter, address, position ) => {

    if( counter % 10000 === 0 ) {

        let msg;

        switch( position )
            {
                
                case "start":
                    msg = `${colors.yellow( "Searching For Stellar Address Starting With ")}${colors.green( address )}    |    ${colors.yellow("Addresses Checked: ")}${colors.red( counter )}`;
                    break;

                case "end":
                    msg = `${colors.yellow( "Searching For Stellar Address Ensing In ")}${colors.green( address )}    |    ${colors.yellow("Addresses Checked: ")}${colors.red( counter )}`;
                    break;

                case "any":
                    msg = `${colors.yellow( "Searching For Stellar Address Containing ")}${colors.green( address )}    |    ${colors.yellow("Addresses Checked: ")}${colors.red( counter )}`;
                    break;

                default:
                    msg = `${colors.yellow( "Searching For Stellar Address Starting With ")}${colors.green( address )}    |    ${colors.yellow("Addresses Checked: ")}${colors.red( counter )}`;
                    break;

            }

        console.clear();

        console.log( msg );

    }

}

const halt = ( children ) => {

    for( let i = 0; i < children.length; i++ )
        {

           children[ i ].kill( "SIGINT" ); 

        }

}

if( !isSubprocess ) {

    try {

        if( argv.address !== undefined ) {

            if( /^[A-Za-z0-9]*$/.test( argv.address ) ) {

                const children = [];

                let counter = 0;

                let address = String( argv.address ).toLowerCase();

                let threads = ( argv.threads !== undefined && Number( argv.threads ) > 0 ) ? Number( argv.threads ) : 1;

                let position = ( argv.position !== undefined ) ? String( argv.position ).toLowerCase() : "start";

                position = ( position === "start" || position === "end" || position === "any" ) ? position : "start";

                let offset = ( argv.offset !== undefined ) ? argv.offset : 0;
                
                offset = ( !isNaN( offset ) && Number( offset ) > 0 ) ? Number( offset ) : 0;

                for( let i = 0; i < threads; i++ )
                    {
                        children[ i ] = fork( "./search.js" );

                        children[ i ].on( "message", ( msg ) => {

                            if( typeof msg.counter !== "undefined" ){

                                counter += msg.counter;

                                progress( counter, argv.address, position );

                            } else if( typeof msg.address !== "undefined" ) {

                                if( argv.hide === undefined ) {

                                    console.log( `${colors.yellow( msg.address )}    <=    (${colors.red( msg.privateKey )})` );

                                } else {

                                    const data =
                                        {
                                            address: msg.address,
                                            privateKey: msg.privateKey
                                        }

                                    fs.writeFileSync( path.join( CWD, `${msg.address}.json` ), JSON.stringify( data, null, 2 ) );

                                    console.log( colors.green( `Account Details Saved To JSON File: `), colors.yellow( msg.address ) + ".json" );

                                }

                                halt( children );

                                process.exit( 0 );

                            }

                        });

                        children[ i ].on( "exit", () => {

                            console.log( `Child Process ${i} Exited` );

                        });

                        children[ i ].send({ address: address, position: position, offset: offset });
                    }

            } else {

                throw `Attempting Search With Invalid Characters. A Stellar Address Can Only Contain Letters & Numbers`;

            }

        } else {

            throw `--address Parameter Must Be Set When Running search.js`;
        }

    } catch( err ) {

        console.log( colors.red( err ) );

        process.exit( 0 );

    }

} else {

    process.on( "message", ( msg ) => {

        search( msg.address, msg.position, msg.offset );

    });

}