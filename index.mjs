process.title = "Tool Farm OwO by Eternity_VN - aiko-chan-ai"

//import libraries

import path from "path"
import fs from "fs"
import os from "os"
import open from "open";

//import files

import { collectData } from "./lib/DataCollector.mjs"
import { log } from "./lib/console.mjs"
import { commandHandler, randomInt, reloadPresence, sleep, solveCaptcha, timeHandler } from "./lib/extension.mjs"
import {aPray, main, notify, obOwo, oBuy, ohOwo, sendOwo} from "./lib/SelfbotWorker.mjs"

//define variables
export const FolderPath = path.join(os.homedir(), "data")
export const DataPath = path.resolve(FolderPath, "./data.json")
const LangPath = path.resolve(FolderPath, "./language.json")
let Data = JSON.parse(fs.existsSync(DataPath) ? fs.readFileSync(DataPath) : "{}")

//global variables
export var global = {
    owoID: "408785106942164992",
    commands: {

    }
}
global.channel, global.config, global.language, global.totalcmd = 0, global.totaltext = 0, global.timer = 0;
global.timePray = 30000, //5m
global.captchaDetected = false, global.paused = false, global.lastTime = 0;
global.userChatDetected = false

//check data

if(!fs.existsSync(FolderPath)) {
    fs.mkdirSync(FolderPath)
    fs.writeFileSync(DataPath, "{}")
}

//Process Error Handler

process.on('unhandledRejection', (err) => {
    console.log(err);
    log(err, "PROMISE.ERROR")
});

process.on("SIGINT", function () {
    console.log("\n")
    console.log("\x1b[92mTotal command sent: \x1b[0m" + global.totalcmd)
    console.log("\x1b[92mTotal text sent: \x1b[0m" + global.totaltext)
    console.log("\x1b[92mTotal active time: \x1b[0m" + timeHandler(global.startTime, Date.now()))
    console.log("\x1b[36mSELFBOT HAS BEEN TERMINATED!\x1b[0m")
    process.exit(1)
});

/**
 *CopyRight © 2022 aiko-chan-ai x Eternity
 *From Vietnam with love
**/

(async () => {
    const { client, conf } = await collectData(Data, DataPath);
    global.config = conf;
    client
    .on("ready", async () => {
        log("\x1b[94mLogged In As " + client.user.username, "i")
        global.startTime = new Date();
        reloadPresence(client);
        if(global.config.cmdPrefix) await commandHandler()
        global.channel = client.channels.cache.get(global.config.channelID[0]);
        if(global.config.huntPet){
            obOwo()
            ohOwo()
        }
        if(global.config.autopray){
            aPray()
        }
        if(global.config.textOwo){
            sendOwo()
        }
        main();
    })
    .on("shardReady", () => reloadPresence(client))
    .on("messageCreate", async (message) => {
        const content = message.content.replace(/\u200B/g, "")
        if(global.channel.id === message.channel.id && message.author.username !== global.config.tag
            && message.author.id != "408785106942164992"
            && message.author.id != "519287796549156864"){
            // const time = randomInt(2*60*1000, 5*60*1000)
            // log(`Co nguoi CHAT kia: ${message.author.displayName}-----${global.channel.name}`,"a")
            // log(`Continue after ${time/60000}`,"i")
            // global.channel.send("Hello")
            // global.userChatDetected = true
            // await sleep(time)
            // log("Continue ...","i")
            // global.userChatDetected = false
        }
        if(message.author.id == global.owoID) {
            // I have verified that you are human! Thank you
            if(content.match(/verified that you are.{1,3}human!/igm) && message.channel.type == 'DM') {
                log(`CAPTCHA HAS BEEN RESOLVED${global.config.autoResume ? ", RESTARTING SELFBOT..." : ""}`, "a");
                if(!global.config.autoResume) process.exit(1);
                global.captchaDetected = false;
                if(global.config.huntPet){
                    obOwo()
                    ohOwo()
                    oBuy()
                }
                if(global.config.autopray){
                    aPray()
                }
                if(global.config.textOwo){
                    sendOwo()
                }
                main();
            }
            else if(((content.includes(message.client.user.username) ||
                content.includes(message.guild.members.me.displayName) ||
                content.includes(message.client.user.id)) &&
              (  content.match(/you are human/igm) ||
                content.match(/you a real human/igm))) ||
                (content.includes('Beep Boop') && message.channel.type == 'DM')) {
                console.log("\n");
                console.log("\x1b[92mTotal command sent: \x1b[0m" + global.totalcmd);
                console.log("\x1b[92mTotal text sent: \x1b[0m" + global.totaltext);
                console.log("\x1b[92mTotal active time: \x1b[0m" + timeHandler(global.startTime, Date.now()));
                console.log("\x1b[36mSELFBOT HAS BEEN TERMINATED!\x1b[0m");

                log("WAITING FOR THE CAPTCHA TO BE RESOLVED TO RESTART...", "a")
                global.captchaDetected = true;
                // await notify(message)
                await open("https://owobot.com/captcha",{ app: 'google chrome' });
                if(!global.config.autoResume) process.exit(1);
            }

            else if(content.match(/have been banned/) && (message.channel.type == 'DM' || content.includes(message.guild.members.me.displayName))) {
                log("ACCOUNT HAS BEEN BANNED, STOPPING SELFBOT...", "e")
                process.kill(process.pid, "SIGINT");
            }

            if(message.embeds.length){
                message.embeds.forEach(item=>{
                    if(item.author?.name?.includes((global.config.aliasName||"").trim())){
                        const textResult = item.footer?.text
                        if(textResult){
                            if(textResult.includes('You lost')){
                                log(`LOST STREAK ---------------- ${global.channel.name}`,"i")
                            }else if(textResult.includes('Battle was too long')){
                                log(`TIE STREAK--------------------------${global.channel.name}`,"i")
                            }else{
                                const match = textResult.match(/\d+/g)
                                if(match && match.length === 4){
                                    log(`STREAK: ${match[match.length -1]}____EXP: ${Number(match[1]) +Number(match[2])}`,"i")
                                }
                                else if(match && match.length === 3){
                                    log(`STREAK: ${match[match.length -1]}____EXP: ${Number(match[1])}`,"i")
                                }
                            }
                        }
                    }
                })
            }
        }
        if(message.author.id == global.config.userNotify) {
            let msgr = message
            if(message.channel.type == "DM" && global.captchaDetected && message.channel.recipient.id === global.config.userNotify) {
                if(message.content.match(/^[a-zA-Z]{3,6}$/)) {
                    let filter = m => m.author.id === global.owoID && m.channel.type == 'DM' && m.content.match(/(wrong verification code!)|(verified that you are.{1,3}human!)|(have been banned)/gim)
                    try {
                        const owo = message.client.users.cache.get(global.owoID)
                        if(!owo.dmChannel) owo.createDM()
                        await owo.send(message.content)
                        const collector = owo.dmChannel.createMessageCollector({filter, max: 1, time: 15_000})
                        collector.on("collect", msg => {
                            console.log(msg.content);
                            msgr.reply(msg.content)
                        })
                    } catch (error) {
                        msgr.reply("An Error Occurred, Please Check The Account Yourself")
                    }
                } else {
                    return msgr.reply("Wrong syntax, this message will not be sent to OwO Bot!")
                }
            }
        }
    }).on("messageCreate", async message => {
        if(global.config.cmdPrefix && (message.author.id == global.config.userNotify || message.author.id == message.client.user.id)) {
            if(!message.content.startsWith(global.config.cmdPrefix)) return;
            const args = message.content.slice(global.config.cmdPrefix.length).split(/ +/)
            const commandName = args.shift().toLowerCase()
            if(!global.commands[commandName]) return;
            try {
                message.channel.sendTyping();
                await sleep(randomInt(680, 3400));
                await global.commands[commandName].callback(message, ...args)
            } catch (error) {
                log("An Error Occurs While Trying To Perform Command", "e")
                console.log(error);
            }
        }
    })
    client.emit("ready")
})()