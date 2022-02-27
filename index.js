const {Client, Intents, User, Interaction, MessageReaction} = require('discord.js');
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
                if (answer === 4){ //Aka the "..." reponse, don't reset timer
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
        msg = await message.channel.send('☎️ *ring ring*');
        channelID = message.channel.id;
        setTimeout(() => {PickUpThePhoneBaby()}, 3000);
    }
});


//Telephone bullshit
async function StartCall() {
    if (!PhoneID) {
        PhoneID = setInterval(function(){
            tilhangup++;
            console.log(tilhangup);
            //Now Hang up until it reaches these seconds
            if (tilhangup > 14) {
                if (tilhangup == 15)
                {
                    try{
                        client.channels.cache.get(channelID).send("*hangs up phone*");
                        channelID = null;
                    }
                    catch(e){
                        console.log(`Nooo fiddlesticks, what now?\nLogged:${e}`)
                    }
                }
                incall = false;
                tilhangup = 0;
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
    client.user.setPresence({ activities:[{name: 'your call || b!ask', type:'LISTENING'}], status:'dnd'} );
    console.log(channelID);
    client.channels.cache.get(channelID).send("Ben?");
    StartCall();
}

client.login(token);
