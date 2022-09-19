# Stellar Vanity Address Generator

**Stellar vanity address generator written in Javascript inteded to be run using Node.js.**

*This project was created because I could not find a working vanity address generator for Stellar. This is an extremely simple project by design for the sake of reviewing the code to ensure it is safe to use. The instructions are written for people with little technical knowledge. If you're familiar with Node.js you can likely skip the instructions and move onto  using the script.*

## Prerequisites

Node.js is the only requirement for running the script. Download and install Node.js for your operating system.

[https://nodejs.org/en/download/](https://nodejs.org/en/download/)


## Installation
***You Need Te Be Connected To The Internet To Setup The Project. Once The Project Setup Is Complete, If Desired, You Can Disconnect From The Internet When Searching For A Vanity Address. Disconnecting From The Internet Is Not A Requirement To Run The Script.***

[ 1 ] - Download the code from [GitHub](https://github.com/mcbeav/stellar-vanity-gen), and extract the archive.

[ 2 ] - You'll need to do 1 of 2 options
- Open the Terminal / Command Prompt and navigate to the Stellar Vanity Generator extracted folder
- Open the Stellar Vanity Generator extracted folder in Visual Studio Code

[ 3 ] - Run the command ***npm install*** in the Terminal / Command Prompt to download the required node modules for the script to run.

	npm install

[ 4 ] - Once the node modules have finished installing, if desired, you can disconnect from the internet and run the script. It is not a requirement to disconnect from the internet when running the script.


## Help

- Download the code from GitHub, and extract the archive, presumably in your Downloads folder.
- Download & install Node.js from [https://nodejs.org/en/](https://nodejs.org/en/)
- [ Windows ] - Open the ***Node.js command prompt*** that you'll find in the Start Menu inside of the Node.js folder.
- [ MacOS | Linux ] - Open the Terminal application
- You'll need to navigate to the Stellar Vanity Generator folder you extracted inside your Downloads folder. You'll do this by using the ***cd*** command. You'll type cd followed by the name of the folder you want to move into.


		cd Downloads/Stellar-vanity-gen
			
			
- Now you'll need to run the command ***npm install*** to install the required node modules to run the script

		npm install
			
- Once the node modules finish installing, the script is ready to run.

- Alternatively, instead of using the command line, you can download and install [Visual Studio Code](https://code.visualstudio.com/download) ( [https://code.visualstudio.com/download](https://code.visualstudio.com/download) ).
- Once Visual Studio Code is installed, open the Stellar Vanity Generator extracted folder in Visual Studio Code.
- Open the terminal in Visual Studio Code
	- View -> Terminal
- Run the ***npm install*** command inside of the terminal to download the required node modules for the script to run.
- Once the node modules are downloaded the script is ready to run.


## Run

- Running the script is as simple as calling node search.js in the terminal and passing the desired options

		node search.js [ options ]


## Options

### address 
- Your desired vanity address to search for.
	- This is required for the script to run

>

        node search.js --address [ string ]

> **Searches For An Address Starting With The String Fish**

	    node search.js --address fish
			
> **Example Matching Address**

	    zil1fish8kz6ya8c3y2qdzza6pve5fwtuq8nfy8c99
			
### position
- Specifies if the address search should match the start of the address, the end of the address, or anywhere in the address.
    - **start**
        - searches the start of the address
    - **end**
        - searches the end of the address
    - **any**
        - checks anywhere inside of the address
>

        node search.js --positon [ start | end | any ]
			
> **Searches For An Address Ending With The String Fish**

	    node search.js --address fish --position end
	

### offset
- Specifies How Many Characters To Offset From The Chosen Position To Search For A Match
    - If The Position Is Set To Start It Will Search For The Matching Address Starting From The Number Set As The Offset
    - If The Position Is Set To End It Will Search For A Matching Address 

        node search.js --offset [ number ]
			
> **Searches For An Address With The String FISH Starting From The 2nd Character**
> This Allows The Matching Address To Start With Any Character & Then Search For Your Match
> Stellar Generates Addresses Starting With The Same Letter For A Long Period Of Time, You Will Have Much Better Luck Finding A Match By Using An Offset Of 1 Or More

	    node search.js --address fish --position start --offset 1

>
	
### threads
- Sets the number of threads to use when searching for an address.
- The script will spawn new processes using workers to increase performance
    - Unless specified, the script will only spawn a single worker

>

        node search.js --threads [ Number ]
				
> **Searches For An Address Containing The String Fish & Spawns 8 Worker Threads To Increase Searching Performance**

	    node search.js --address fish --position any --threads 8

### hide
- When a match is found it is logged to the console. If you wish to hide the output in the console and write the data to a JSON file the hide parameter can be used.
- Setting hide to true will hide the console output when a match is found and the address, public key, private key, and hex encoded address will be written to a JSON file in the root of the project directory

>

       node search.js --hide true

>

> **Searches For An Address Starting With The String Fish. When A Match Is Found The Output Is Saved To A JSON File That Has The Name Of The Matching Address**

        node search.js --address fish --position start --hide true

## Output
- When a match is found the Stellar formatted address and the private key will be displayed in the console

> **Example Output When A Match Is Found**

    Address     <=      Private Key

>

    zil1mknd8kz6ya8c3y2qdzza6pve5fwtuq8nfy8c99    <=    (8d72df280c2df6df52dc07967e059c73ef8b245c2de66d4d24fa16788dd8cb64)

- If the **--hide** option is passed when calling the script, nothing will be output to the console, and instead the information will be saved to a JSON file

> **Output Displayed In The Console When --hide Option is Passed**

>

    Account Details Saved To JSON File:  zil1m0hcm5xu33yap0vw2u38fz9m7e0x3clk3jsqj3.json

> **Contents Of zil1m0hcm5xu33yap0vw2u38fz9m7e0x3clk3jsqj3.json**

>

    {
    "address": "zil1m0hcm5xu33yap0vw2u38fz9000003clk3jsqj3",
    "hexAddress": "0xdbeF8DD0dc8c49D0bD8e5722740000065e68e3f6",
    "publicKey": "036f2e973028a0f9b4346fe000000c3b2a5a2823c067893a47d9597df8c0100000",
    "privateKey": "964dd0a300000375a4eafde7e7396efd1bf902da8a241c3319b8cead82e00000"
    }


## To Do:
- Create an option to generate a mnemonic phrase instead of only the private key.