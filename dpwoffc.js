const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateWAMessageFromContent
} = require("@vkazee/baileys");

const P = require("pino");
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { text } = require("stream/consumers");
const { title } = require("process");
const { url } = require("inspector");

function getMessageText(msg){
  if(!msg.message) return "";
  const m = msg.message;
  if(m.conversation) return m.conversation;
  if(m.extendedTextMessage) return m.extendedTextMessage.text;
  if(m.buttonsResponseMessage) return m.buttonsResponseMessage.selectedButtonId;
  if(m.listResponseMessage) return m.listResponseMessage.singleSelectReply.selectedRowId;
  if(m.templateButtonReplyMessage) return m.templateButtonReplyMessage.selectedId;
  if(m.interactiveResponseMessage){
    const json = m.interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson;
    if(json){
      try{
        const data = JSON.parse(json);
        return data.id || data.button_id || data.selected_row_id || "";
      }catch{
        return "";
      }
    }
  }
  return "";
}

const owner = "6285786335575@s.whatsapp.net";

const dbPath = "./database/grupTarget.json";

const grupUrlPath = path.join(__dirname, "./database/grupUrl.json")
let grupUrlData = JSON.parse(fs.readFileSync(grupUrlPath))

let urlList = grupUrlData.map(obj => Object.values(obj)[0])

let dynamicButtons = urlList.map((url, index) => ({
  name: "cta_url",
  buttonParamsJson: JSON.stringify({
    display_text: `GB ${index + 1}`,
    url: url
  })
}))

function loadGroupDB(){
  if(!fs.existsSync(dbPath)){
    fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
  }
  return JSON.parse(fs.readFileSync(dbPath));
}

function saveGroupDB(data){
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: P({ level:"silent" }),
    auth: state,
    printQRInTerminal: true,
    browser:["DPWOFFC BOT","Chrome","1.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if(qr){
      console.log("📲 Scan QR untuk login WhatsApp");
    }

    if(connection === "open"){
      console.log("✅ Bot telah aktif");
    } if(connection === "close"){
  const statusCode = lastDisconnect?.error?.output?.statusCode;
  if(statusCode && statusCode !== 401){
    console.log("⚠️ Reconnect in 5s...");
    setTimeout(startBot, 5000);
  } else {
    console.log("❌ Session invalid atau logout, perlu scan QR lagi");
  }
}
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    await sock.readMessages([msg.key]);
    if(!msg.message) return;
    const isFromMe = msg.key.fromMe;
    const from = msg.key.remoteJid;
    if(from === "status@broadcast") return;
    let body = getMessageText(msg);
    console.log("Pesan:", body);

    if(!body) return;
    if(!body.startsWith(".")) return;

    const cmd = body.slice(1).trim().toLowerCase();

const fakeQuote = {
    key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
    },
    message: {
        imageMessage: {
            mimetype: 'image/jpeg',
            caption: '@dpwoffc'
        }
    }
}

const username = msg.pushName || "Kak";
const textMenu = (`
╔══════════╗
     🚀 J P M B O T 🚀
╚══════════╝

*Powered by: @dpwoffc*

👋 Halo Kak, *${username}* Selamat datang di layanan
otomasi terbaik untuk promosi Anda.

┌── 『 INFO SYSTEM 』
│
├ 👤 Creator: *@dpwoffc*


┌── 『 MAIN MENU 』
│
├ addjpm
├ addjpmch
├ deljpm
├ deljpmch
├ jpm 
├ jpmch
└    

──────────────────────────
💡 Gunakan dengan bijak.

*Support: @dpwoffc*
──────────────────────────`)

const addJpmText = (`
👋 Hai silahkan pilih grup 
yang ingin di tambahkan 
ke *database* target
    `)

const addJpmTextSuccess = (`
✅ Berhasil menambahkan grup ke
*database target jpm*
  `)

const addJpmTextFaield = (`
❎ Gagal menambahkan grup ke
*databse target jpm*
  `)

const startJpmText = (`
🚀 Memulai JPM ke seluruh target
  `)

const doneJpmText = (`
✅ Proses JPM telah selesai
  `)

const jpmText = (`
*CARI GB ISIAN PERAKAN SAMA JB TERBUKA?? KLICK BUTTON DIBAWAH NTAR DIKIRIM LINK GB NYA*`)

const textPromosi = (`
*MAU JPM TAPI GA MAU BAYAR??*

*BUY AE NIH SC JPM*
KEUNTUNGAN:
1. SC BUATAN SENDIRI
2. TIDAK TERDETEKSI ANTI LINK
3. PESAN GA BISA DI COPY
4. MEMAKAI BUTTON
5. FULL NO ENC
6. BISA OPEN JPM SENDIRI

PRICE?? MURMER CUMA 10K
MINAT??? KLICK TOMBOL OWNER
  `)

    if(["dpwoffc","jpm","dpwjpm"].includes(cmd)){
      const message = generateWAMessageFromContent(from,{
        viewOnceMessage:{
          message:{
            interactiveMessage:{
              header:{ 
                hasMediaAttachment: false
              },
              body:{ 
                text: textMenu 
              },
              footer:{ 
                text:"DPW JPM BOT v1.0" 
              },
                contextInfo: {
                quotedMessage: fakeQuote.message,
                remoteJid: fakeQuote.key.remoteJid,
                participant: fakeQuote.key.participant,
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                  showAdAttribution: true,
                  title: "@dpwoffc",
                  body: "Dwi Putra Wibowo",
                  mediaType: 1,
                  previewType: 0,
                  renderLargerThumbnail: true,
                  sourceUrl: "https://dpwoffc.my.id"
                }
              },
              nativeFlowMessage:{
                buttons:[
                    {
                        name:"quick_reply",
                        buttonParamsJson:JSON.stringify({
                            display_text: "Add JPM",
                            id: ".addjpmgb"
                        })
                    },
                    {
                        name: "quick_reply",
                        buttonParamsJson:JSON.stringify({
                            display_text: "Del JPM",
                            id:".deljpmgb"
                        })
                    },
                    {
                        name: "quick_reply",
                        buttonParamsJson:JSON.stringify({
                            display_text: "Menu",
                            id: ".dpwoffc"
                        })
                    },
                    { 
                        name:"cta_url", 
                        buttonParamsJson:JSON.stringify({ 
                            display_text:"TikTok", 
                            url:"https://tiktok.com/@dpwoffc" 
                        }) 
                    },
                    { 
                        name:"cta_url", 
                        buttonParamsJson:JSON.stringify({ 
                            display_text:"Instagram", 
                            url:"https://instagram.com/dpwoffc" 
                        }) 
                    },
                    {
                      name: "cta_url",
                      buttonParamsJson:JSON.stringify({
                        display_text: "GB HOSTING BY DPWOFFC",
                        url:"https://chat.whatsapp.com/K0G2Dlt82qZCqGZNsIxlpL"
                      })
                    },
                    { 
                        name:"cta_url", 
                        buttonParamsJson:JSON.stringify({ 
                            display_text:"Channels", 
                            url:"https://whatsapp.com/channel/0029Vb7aAXy8qIzveiojzU0h" 
                        }) 
                    },
                    { 
                        name:"single_select", buttonParamsJson:JSON.stringify({
                        title:"List Menu",
                        sections:[
                            {
                                title:"Menu Bot",
                                rows:[
                                    {
                                      header: "Start JPM",
                                      title: "Start Proses JPM",
                                      id: ".startjpm"
                                    }
                                ]
                            }
                        ]
                    })
                  }
                ]
              }
            }
          }
        }
      },{ quoted: fakeQuote});

      await sock.relayMessage(from,message.message,{ messageId: message.key.id });
    }

if (cmd.startsWith("addlink")) {

  const grupUrlPath = path.join(__dirname, "./database/grupUrl.json")

  const url = body.split(" ").slice(1).join(" ").trim()

  if (!url)
    return sock.sendMessage(from, { 
      text: "❎ Masukkan link grup WhatsApp.\n\nContoh:\n.addlink https://chat.whatsapp.com/xxxx" 
    }, { quoted: fakeQuote })

  if (!url.startsWith("https://chat.whatsapp.com/"))
    return sock.sendMessage(from, { 
      text: "❎ Link tidak valid." 
    }, { quoted: fakeQuote })

  try {

    let data = []

    if (fs.existsSync(grupUrlPath)) {
      data = JSON.parse(fs.readFileSync(grupUrlPath))
    }

    // Anti duplikat
    const exists = data.some(obj => Object.values(obj)[0] === url)
    if (exists)
      return sock.sendMessage(from, { 
        text: "❎ Link sudah ada di database." 
      }, { quoted: fakeQuote })

    const nextNumber = data.length + 1

    data.push({ [nextNumber]: url })

    fs.writeFileSync(grupUrlPath, JSON.stringify(data, null, 2))

    await sock.sendMessage(from, {
      text: `✅ Link berhasil ditambahkan sebagai GB ${nextNumber}`
    }, { quoted: fakeQuote })

  } catch (err) {
    console.log(err)
    await sock.sendMessage(from, {
      text: "❎ Gagal menambahkan link."
    }, { quoted: fakeQuote })
  }
}

if(["addjpmgb"].includes(cmd)){
  const groups = await sock.groupFetchAllParticipating()
  const db = loadGroupDB()
  const rows = []
  let count = 0
  for(const id in groups){
    if(count >= 50) break
    const group = groups[id]
    const exists = db.find(g => g.id === id)
    if(!exists){
      rows.push({
        header:"Tambah Grup",
        title: group.subject,
        id: `.addjpmtarget ${id}`
      })
      count++
    }
  }

  if(rows.length === 0){
    return sock.sendMessage(from,{
      text:"❎ Semua grup sudah ada di database JPM"
    },{ quoted: fakeQuote })
  }

  const message = generateWAMessageFromContent(from,{
    viewOnceMessage:{
      message:{
        interactiveMessage:{
          body:{
            text:addJpmText + `
📊 Grup tersedia: ${rows.length}`
          },
          footer:{
            text:"DPW JPM BOT v1.0"
          },
          nativeFlowMessage:{
            buttons:[
              {
                name:"single_select",
                buttonParamsJson:JSON.stringify({
                  title:"Pilih Grup",
                  sections:[
                    {
                      title:"Grup Yang Belum Ditambahkan",
                      rows: rows
                    }
                  ]
                })
              },
              {
                name:"quick_reply",
                buttonParamsJson:JSON.stringify({
                  display_text:"Menu",
                  id:".dpwoffc"
                })
              }
            ]
          }
        }
      }
    }
  },{ quoted: fakeQuote })
  await sock.relayMessage(from,message.message,{ messageId: message.key.id })
}

if(cmd.startsWith("addjpmtarget")){
  const id = cmd.split(" ")[1]
  if(!id) return
  try{
    const metadata = await sock.groupMetadata(id)
    const name = metadata.subject
    let db = loadGroupDB()
    const exists = db.find(g => g.id === id)
    if(exists){
      throw "exists"
    }
    db.push({
      id: id,
      name: name
    })
    saveGroupDB(db)
    const success = generateWAMessageFromContent(from,{
      viewOnceMessage:{
        message:{
          interactiveMessage:{
            body:{
              text:addJpmTextSuccess + `\n\n📌 *${name}*`
            },
            footer:{
              text:"DPW JPM BOT v1.0"
            },
            nativeFlowMessage:{
              buttons:[
                {
                  name:"quick_reply",
                  buttonParamsJson:JSON.stringify({
                    display_text:"Menu",
                    id:".dpwoffc"
                  })
                },
              ]
            }
          }
        }
      }
    },{ quoted: fakeQuote })
    await sock.relayMessage(from, success.message, { messageId: success.key.id })
  }catch{

    await sock.sendMessage(from,{
      text:addJpmTextFaield
    },{ quoted: fakeQuote })
  }
}

if(["deljpmgb"].includes(cmd)){

  const db = loadGroupDB()

  if(db.length === 0){
    return sock.sendMessage(from,{
      text:"❎ Database grup JPM masih kosong"
    },{ quoted: fakeQuote })
  }

  const rows = []
  let count = 0

  for(const group of db){

    if(count >= 50) break

    rows.push({
      header:"Hapus Grup",
      title: group.name,
      id: `.deljpmtarget ${group.id}`
    })

    count++
  }

  const message = generateWAMessageFromContent(from,{
    viewOnceMessage:{
      message:{
        interactiveMessage:{
          body:{
            text:"👋 Silahkan pilih grup yang ingin dihapus dari database JPM"
          },
          footer:{
            text:"DPW JPM BOT v1.0"
          },
          nativeFlowMessage:{
            buttons:[
              {
                name:"single_select",
                buttonParamsJson:JSON.stringify({
                  title:"Pilih Grup",
                  sections:[
                    {
                      title:"Database Grup JPM",
                      rows: rows
                    }
                  ]
                })
              },
              {
                name:"quick_reply",
                buttonParamsJson:JSON.stringify({
                  display_text:"Menu",
                  id:".dpwoffc"
                })
              }
            ]
          }
        }
      }
    }
  },{ quoted: fakeQuote })

  await sock.relayMessage(from,message.message,{ messageId: message.key.id })
}

if(cmd.startsWith("deljpmtarget")){

  const id = cmd.split(" ")[1]

  if(!id) return

  try{

    let db = loadGroupDB()

    const index = db.findIndex(g => g.id === id)

    if(index === -1){
      throw "notfound"
    }

    const name = db[index].name

    db.splice(index,1)

    saveGroupDB(db)

    const success = generateWAMessageFromContent(from,{
      viewOnceMessage:{
        message:{
          interactiveMessage:{
            body:{ text:`✅ Grup berhasil dihapus dari database JPM\n\n📌 *${name}*` },
            footer:{ text:"DPW JPM BOT v1.0" },
            nativeFlowMessage:{
              buttons:[
                {
                  name:"quick_reply",
                  buttonParamsJson:JSON.stringify({
                    display_text:"Menu",
                    id:".dpwoffc"
                  })
                },
              ]
            }
          }
        }
      }
    },{ quoted: fakeQuote })

    await sock.relayMessage(from, success.message, { messageId: success.key.id })

  }catch{

    const fail = generateWAMessageFromContent(from,{
      viewOnceMessage:{
        message:{
          interactiveMessage:{
            body:{ text:"❎ Grup tidak ditemukan di database JPM" },
            footer:{ text:"DPW JPM BOT v1.0" },
            nativeFlowMessage:{
              buttons:[
                {
                  name:"quick_reply",
                  buttonParamsJson:JSON.stringify({
                    display_text:"Menu",
                    id:".dpwoffc"
                  })
                }
              ]
            }
          }
        }
      }
    },{ quoted: fakeQuote })

    await sock.relayMessage(from, fail.message, { messageId: fail.key.id })

  }

}

if(["startjpm"].includes(cmd)){
  let db = loadGroupDB()
  if(db.length === 0){
    return sock.sendMessage(from,{ text:"❎ Database grup JPM masih kosong" })
  }

  await sock.sendMessage(from,{ text:startJpmText },{ quoted: fakeQuote })

  let success = 0
  let failed = 0

  for(const group of db){
    try{
      const metadata = await sock.groupMetadata(group.id)

      const msg = generateWAMessageFromContent(group.id,{
        viewOnceMessage:{
          message:{
            interactiveMessage:{
              body:{
                text: jpmText
              },
              footer:{
                text:"DPW JPM BOT v1.0"
              },
              contextInfo:{
                forwardingScore:999,
                isForwarded:true
              },
              nativeFlowMessage:{
                buttons:[
                  ...dynamicButtons,
                  {
                    name:"cta_url",
                    buttonParamsJson:JSON.stringify({
                      display_text:"GRUP JPM FREE",
                      url:"https://chat.whatsapp.com/K0G2Dlt82qZCqGZNsIxlpL?mode=gi_t"
                    })
                  },
                  {
                    name: "cta_url",
                    buttonParamsJson:JSON.stringify({
                      display_text: "JB HOSTING BY DPWOFFC",
                      url: "https://chat.whatsapp.com/K0G2Dlt82qZCqGZNsIxlpL"
                    })
                  }
                ]
              }
            }
          }
        }
      },{ quoted: fakeQuote })

      await sock.relayMessage(group.id, msg.message, { messageId: msg.key.id })

      success++
      console.log("JPM terkirim:", metadata.subject)

      await new Promise(r => setTimeout(r, 3000))

    }catch(err){
      failed++
      console.log("Gagal kirim:", group.id)
    }
  }

const doneMessage = generateWAMessageFromContent(from,{
  viewOnceMessage:{
    message:{
      interactiveMessage:{
        body:{
          text:`${doneJpmText}
✅ Success : ${success}
❎ Failed : ${failed}`
        },
        footer:{
          text:"DPW JPM BOT v1.0"
        },
        contextInfo:{
          quotedMessage: fakeQuote.message,
          remoteJid: fakeQuote.key.remoteJid,
          participant: fakeQuote.key.participant,
          forwardingScore: 999,
          isForwarded: true
        },
        nativeFlowMessage:{
          buttons:[
            {
              name:"quick_reply",
              buttonParamsJson:JSON.stringify({
                display_text:"Menu",
                id:".dpwoffc"
              })
            }
          ]
        }
      }
    }
  }
},{ quoted: fakeQuote })

await sock.relayMessage(from, doneMessage.message, { messageId: doneMessage.key.id })
}

if(["promosi"].includes(cmd)){
  let db = loadGroupDB()

  if(db.length === 0){
    return sock.sendMessage(from,{
      text:"❎ Database grup JPM masih kosong"
    },{ quoted: fakeQuote })
  }

  await sock.sendMessage(from,{
    text:"🚀 Mengirim teks promosi ke semua grup target..."
  },{ quoted: fakeQuote })

  let success = 0
  let failed = 0

  for(const group of db){
    try{
      const msg = generateWAMessageFromContent(group.id,{
        viewOnceMessage:{
          message:{
            interactiveMessage:{
              header:{
                hasMediaAttachment: false
              },
              body:{
                text: textPromosi
              },
              footer:{
                text:"DPW JPM BOT v1.0"
              },
              nativeFlowMessage:{
                buttons:[
                  { 
                    name:"cta_url", 
                    buttonParamsJson:JSON.stringify({ 
                      display_text:"OWNER", 
                      url:"https://wa.me/6285786335575" 
                    }) 
                  }
                ]
              },
              contextInfo:{
                forwardingScore:999,
                isForwarded:true
              }
            }
          }
        }
      },{ quoted: fakeQuote })

      await sock.relayMessage(group.id, msg.message, { messageId: msg.key.id })

      success++
      await new Promise(r => setTimeout(r, 2000)) // delay biar aman

    }catch(err){
      failed++
      console.log("Gagal kirim ke:", group.id)
    }
  }

  await sock.sendMessage(from,{
    text:`✅ Promosi selesai

📊 Total Grup : ${db.length}
✅ Berhasil : ${success}
❌ Gagal : ${failed}`
  },{ quoted: fakeQuote })
}

  });
}

startBot();