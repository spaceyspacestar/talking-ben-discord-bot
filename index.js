const {Client, Intents} = require('discord.js');
const {token} = require("./config.json");

//Init Client
const client = new Client({ partials: ["CHANNEL"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]});
const prefix = "b!";


client.on('ready', async() => {
    console.log(`Logged in`);
    client.user.setPresence({ activities:[{name: 'users talk || b!ask', type:'LISTENING'}], status:'online'} );
    
});

//Telephone stuff
let incall = false;
let tilhangup = 0;
let channelID = null; //Store channel info to send hang up message 
let PhoneID;
let callstate = 0; //avoid breaking with the callben command

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    //The funny
    if (command === 'ask')
    {
            if (incall === false)
            {
                message.channel.send("`Call ben first before you can talk to him\nuse b!callben`");
            }
            else {
            if (!args[0]) {
                return
            }
            else {
                let response = ['Uuuggghhhh...', 'Ho ho ho..!', 'No.', 'Yeeesss.', '...'];
                let answer = (Math.floor(Math.random() * Math.floor(response.length)));
                if (answer === 4){ //Aka the "..." reponse, don't reset the counter
                    message.channel.send({content: response[answer]});
                }  
                else {
                    message.channel.send({content: response[answer]});
                    tilhangup = 0;
                }
            }
        }
    }
    else if (command === 'callben')
    {
        switch(callstate)
        {
            case 0: //Not in a phone right now
                msg = await message.channel.send('☎️ *ring ring*');
                channelID = message.channel.id;
                guildname = message.guild.name; //so we can print the server name
                setTimeout(() => {PickUpThePhoneBaby()}, 3000);
                callstate = 1;
                break;
            case 1: //Currently in a phone
                if (message.member.channelID === message.guild.channelID){
                    message.channel.send(`You are already on the phone with Ben...\nGo to <#${channelID} so you can ask him questions`);
                }
                break;
        }

    }
    else if (command === 'hangup')
    {
        switch(callstate)
        {
            case 0:
                message.channel.send("You are not in a call currently.")
                return;
            case 1:
                tilhangup = 14; //lol
                break;
        }
    }
});

//Time
var currentdate = new Date(); 
var datetime =  + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

//Telephone bullshit
async function StartCall() {
    if (!PhoneID) {
        PhoneID = setInterval(function(){
            tilhangup++;
            console.log(`Hang up integer: ${tilhangup}`)
            //Now Hang up until it reaches these seconds
            if (tilhangup > 14) {
                if (tilhangup == 15)
                {
                    try{
                        client.channels.cache.get(channelID).send("*hangs up phone*");
                        console.log("Hunged up the phone");
                        channelID = null;
                    }
                    catch(e){
                        console.log(`Nooo fiddlesticks, what now?\nLogged:${e}`)
                    }
                }
                incall = false;
                tilhangup = 0;
                callstate = 0;
                clearInterval(PhoneID);
                PhoneID = null;
                client.user.setPresence({ activities:[{name: 'users talk || b!ask', type:'LISTENING'}], status:'online'} );
            }
        }, 1000);
    }
}

async function PickUpThePhoneBaby() {
    msg.edit('*picks up phone*');
    incall = true;
    console.log(`Initiated a call in ${guildname} at ${datetime}`);
    client.user.setPresence({ activities:[{name: 'your call || b!ask', type:'LISTENING'}], status:'dnd'} );
    client.channels.cache.get(channelID).send("Ben?");
    StartCall();
}

client.login(token);