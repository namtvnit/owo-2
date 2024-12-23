import { spawn } from "child_process";
import { global, DataPath } from "../index.mjs";
import { log } from "./console.mjs";
import { randomInt, sleep, webAccess } from "./extension.mjs";
import { MessageAttachment, MessageEmbed, WebhookClient } from "discord.js-selfbot-v13";
import fs from "fs";
import moment from "moment-timezone";

var channeltimeout = randomInt(30, 42), runtimeout = randomInt(57, 92), othertimer;
let oh="oh"
let ob ="ob"
let odaily = "owo daily", opray = "owopray", oinv = "owoinv", olb = "owolb all", ouse = "owouse", ordinary = ["owoh","owob"], oother = ["owo run", "owo pup", "owo piku"], ohb = "owo huntbot"
let owo = "owo";
var inv, gem, gem1 = 0, gem2 = 0, gem3 = 0, box = false;

export function aCheck(flag = false) {
    if(!(global.resetTime || global.resetTime instanceof Date || isNaN(global.resetTime))) global.resetTime = moment.utc(global.startTime).set({ hour: 0, minute: 0, second: 0 }).toDate();
    if(global.startTime >= global.resetTime) global.resetTime = moment.utc(global.resetTime).add(1, "day").toDate();
    const currentTime = moment.utc().toDate();
    if(currentTime >= global.resetTime || flag) {
        try {
            gem1 = 0, gem2 = 0, gem3 = 0;
            global.resetTime = moment.utc(global.resetTime).add(1, "day").toDate();
            global.config = JSON.parse(fs.readFileSync(DataPath))[global.channel.client.user.id];
            return log("The configuration has been refreshed successfully", "i")
        } catch (error) {
            console.log(error);
            return log("Failed to refresh the configuration", "e")
        }
    }
}

export async function aPray() {
    if (global.captchaDetected) return
    global.channel.sendTyping();
    const timePray = global.config.timePray
    if(+timePray === 5){
       await sleep(60000);
       global.config.timePray = "0"
    }else if(+timePray===0){
       await sleep(5*60*1000);
    }else{
        const time = +timePray*60*1000
       await sleep(time);
        global.config.timePray = "0"
    }

    const userPray = global.config.userIdPray
    if(userPray){
        const id = `owopray <@${userPray}>`
        global.channel.send(id);
        log(id);
    }else{
        global.channel.send("owopray");
        log("owopray");
    }
    global.totalcmd++;
    global.timer = 0;
    await aPray()
}

export async function sendOwo() {
    if (global.captchaDetected) return;
    if(!global.userChatDetected){
        global.channel.sendTyping();
        global.channel.send(owo)
        log("Send text owo", "i")
    }
    await sleep(11000)
    await sendOwo()
}

export async function oBuy() {
    await sleep(1000)
    if (global.captchaDetected) return;
    if(!global.userChatDetected){
        global.channel.sendTyping();
        global.channel.send("obuy 2")
        log("Obuy ", "i")
    }
    await sleep(1500)
    await sendOwo()
}

async function changeChannel() {
    let arr = global.config.channelID.filter(cnl => cnl !== global.channel.id);
    global.channel = global.channel.client.channels.cache.get(arr[randomInt(0, arr.length)])
    log("Channel Changed To: #" + global.channel.name, "i")
    channeltimeout = global.totalcmd + randomInt(13, 42)
}

async function aGem(param1, param2, param3) {
    if (global.captchaDetected) return;
    const filter = msg => msg.author.id === global.owoID  && msg.content.includes(msg.guild.members.me.displayName) && msg.content.match(/Inventory/)
    global.channel.sendTyping();
    await sleep(randomInt(680, 3400));
    if (global.captchaDetected) return;
    global.channel.send(oinv);
    log(oinv)
    global.totalcmd++
    const collector = global.channel.createMessageCollector({filter, max: 1, time: 10_000})
    collector.on("collect", async (m) => {
        inv = m.content.split("`")
        gem1 = inv.filter(elm => elm.match(/^05[1-7]$/))
        gem2 = inv.filter(elm => elm.match(/^(06[5-9]|07[0-1])$/))
        gem3 = inv.filter(elm => elm.match(/^07[2-8]$/))
        box = global.config.autoLootbox ? inv.indexOf("050") >= 0 ? true : false : false
        if(box) {
            global.channel.sendTyping();
            await sleep(randomInt(680, 3400));
            global.channel.send(olb);
            log(olb);
            global.totalcmd++;
            await sleep(randomInt(8100, 9800))
            return aGem(param1, param2, param3);
        }
        gem = gem1.length + gem2.length + gem3.length;
        log("Found " + gem + " Hunt Gems In Inventory", "i");
        if(!gem > 0 && !box) return global.config.autoGem = false;
        gem1 = gem1.length > 0 ? global.config.gemOrder === 0 ? Math.max(...gem1) : Math.min(...gem1) : "";
        gem2 = gem2.length > 0 ? global.config.gemOrder === 0 ? Math.max(...gem2) : Math.min(...gem2) : "";
        gem3 = gem3.length > 0 ? global.config.gemOrder === 0 ? Math.max(...gem3) : Math.min(...gem3) : "";
        global.channel.sendTyping();
        await sleep(randomInt(5300, 6800));
        global.channel.send(`${ouse} ${param1 ? gem1 : ""} ${param2 ? gem2 : ""} ${param3 ? gem3 : ""}`.replace(/\s+/g, " "));
        log(`${ouse} ${param1 ? gem1 : ""} ${param2 ? gem2 : ""} ${param3 ? gem3 : ""}`.replace(/\s+/g, " "));
        global.totalcmd++;
    })
}

async function aQuote() {
    if (global.captchaDetected) return;
    global.channel.sendTyping()
    await sleep(randomInt(2300, 5800))
    const percent = randomInt(0, 2)
    if(percent === 0) {
        if (global.captchaDetected) return;
        global.channel.send(["owo", "uwu"][randomInt(0,2)])
    } else try {
        const str = [
            "Anh yeu em nhiều lắm",
            "Mãi mãi 1 tình yêu",
        ]
        for(let i = 0; i<=str; i++){
         global.channel.send(str[i])
        }
        // const quote = await webAccess("get", "https://selfbot-api-server.vercel.app/api/quote")
    } catch (error) {
        return log("Error While Getting Quote To Send", "e")
    }
    global.totaltext++;
}

export async function notify(message, solved = false) {
    log(`Captcha Found In Channel: #${message.channel.name}`, "a")

    try {
        const target = message.client.relationships.friendCache.get(global.config.userNotify)
        if(!target.dmChannel) target.createDM()
        const calling = await target.dmChannel.call()
        setTimeout(() => {
            calling.disconnect()
        }, 30_000);
    } catch (error) {
        console.log(error);
        log("Could Not Call The Notification Recipient", "e")
    }
}

export async function ohOwo() {
    if (global.captchaDetected) return;
    if(!global.userChatDetected){
        await sleep(50)
        let text = oh
        if(global.config.cmdPrefix){
            text = `${global.config.cmdPrefix}h`
        }
        global.channel.sendTyping()
        global.channel.send(text)
        global.totalcmd++
        log(text)
        if(global.config.autoGem){
            var filter = m => m.author.id == global.owoID && m.content.includes(m.guild.members.me.displayName) && m.content.match(/hunt is empowered by| spent 5 .+ and caught a/)
            const collector = global.channel.createMessageCollector({filter, max: 1, time: 10_000})
            collector.on("collect", async (msg) => {
                let param1, param2, param3;
                param1 = !msg.content.includes("gem1") && typeof gem1 == "number";
                param2 = !msg.content.includes("gem3") && typeof gem2 == "number";
                param3 = !msg.content.includes("gem4") && typeof gem3 == "number";
                if (param1 || param2 || param3) await aGem(param1, param2, param3);
            })
        }
    }

    await sleep(15500)
    await ohOwo()
}

export async function obOwo() {
    if (global.captchaDetected) return;
    if(!global.userChatDetected){
        await sleep(500)
        let text = ob
        if(global.config.cmdPrefix){
            text = `${global.config.cmdPrefix}b`
        }
        global.channel.sendTyping()
        global.channel.send(text)
        global.totalcmd++
        log(text)
    }
    await sleep(16500)
    await obOwo()
}



export async function main() {
    if(global.config.autoPray && (global.timer >= 360000 || global.totalcmd <= 2)) await aPray()

    if(global.config.channelID.length > 1 && global.totalcmd >= channeltimeout) await changeChannel()
    // if(global.config.autoSleep && global.totalcmd >= runtimeout) await aSleep()
    if(!global.userChatDetected){
        if(global.config.autoQuote) await aQuote()
    }
    await sleep(randomInt(10000,20000))
    main();
}