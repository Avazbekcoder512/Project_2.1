const { bot } = require("../bot")
const User = require("../../model/user.model")
const Menu = require("./Menu")

const currentDate = new Date()

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0') 
const day = String(currentDate.getDate()).padStart(2, '0')
const hours = String(currentDate.getHours()).padStart(2, '0')
const minutes = String(currentDate.getMinutes()).padStart(2, '0')
const seconds = String(currentDate.getSeconds()).padStart(2, '0')

const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`

const start = async (msg) => {
    const chatId = msg.from.id
        

    const user = await User.findOne({chatId: chatId}).lean()

    if (!user) {
        const newUser = new User({
            first_name: msg.from.first_name,
            last_name: msg.from.last_name,
            username: msg.from.username,
            chatId,
            admin: false,
            createdAt: formattedDate,
        })
        await newUser.save()
        bot.sendMessage(chatId, 
`Tilni tanlang. 
Выберите язык. 
Select a language.`, 
        {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "🇺🇿 O'zb",
                        callback_data: "O'zbek tili"
                    }],
                    [{
                        text: "🇷🇺 Rus",
                        callback_data: "Rus tili"
                    },
                    {
                        text: "🇬🇧 Eng",
                        callback_data: "Ingliz tili"
                    }]
                ],
            }
        })
    } else if (user) {
        bot.sendMessage(chatId, 
`Tilni tanlang.
Выберите язык.
Select a language.`, 
            {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "🇺🇿 O'zb",
                            callback_data: "O'zbek tili"
                        }],
                        [{
                            text: "🇷🇺 Rus",
                            callback_data: "Rus tili"
                        },
                        {
                            text: "🇬🇧 Eng",
                            callback_data: "Ingliz tili"
                        }]
                    ],
                }
            })
    } else if (user.language) {
        Menu(msg)
    }
}

const addContact = async (msg) => {
    const chatId = msg.from.id
    const user = await User.findOne({chatId: chatId}).lean()

    if (msg.text) {
        switch (user.language) {
            case "O'zb":
                bot.sendMessage(chatId, "Iltimos Telefon raqamni yuborish tugmasini bosing!", {
                    reply_markup: {
                        keyboard: [
                            [{ text: "📱 Telefon raqamni yuborish", request_contact: true}]
                        ],
                        resize_keyboard: true
                    }
                })
                break;
            case "Rus":
                bot.sendMessage(chatId, "Пожалуйста, нажмите кнопку отправить номер телефона!", {
                    reply_markup: {
                        keyboard: [
                            [{ text: "📱 Отправить номер телефона", request_contact: true }]
                        ],
                        resize_keyboard: true
                    }
                })
                break;
            case "Eng":
                bot.sendMessage(chatId, "Please click the send phone number button!", {
                    reply_markup: {
                        keyboard: [
                            [{ text: "📱 Send phone number", request_contact: true }]
                        ],
                        resize_keyboard: true
                    }
                })
                break;
        }
    } else if (msg.contact.phone_number) {
        user.phone = msg.contact.phone_number
        user.admin = msg.contact.phone_number == "+998919194373"
        await User.findByIdAndUpdate(user._id, user, {new:true})
        
        switch (user.language) {
            case "O'zb":
                bot.sendMessage(chatId, "Botdan to'liq foydalanish uchun Menyuni bosing", {
                    reply_markup: {
                        keyboard: [
                            [{ text: "Menyu" }]
                        ],
                        resize_keyboard: true
                    }
                })
                break;
            case "Rus":
                bot.sendMessage(chatId, "Нажмите «Меню», чтобы полностью использовать бота.", {
                    reply_markup: {
                        keyboard: [
                            [{ text: "Меню" }]
                        ],
                        resize_keyboard: true
                    }
                })
                break;
            case "Eng":
                bot.sendMessage(chatId, "Click the Menu button to fully utilize the bot", {
                    reply_markup: {
                        keyboard: [
                            [{ text: "Menu" }]
                        ],
                        resize_keyboard: true
                    }
                })
                break;
        }
    }
}

module.exports = { start, addContact }