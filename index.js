const RPC = require("discord-rpc");
const axios = require("axios");
const client = new RPC.Client({
    transport: "ipc"
})
const ClientID = "" //application id
const latlong = "" //latitude and longitude
const wtapikey = "" //weatherapi api key
const url = `https://api.weatherapi.com/v1/current.json?key=${wtapikey}&q=${latlong}&aqi=no`

async function setActivity() {
    try {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const d = now.getDate();
        const dt = new Date(y, m - 1, d, 0, 0, 0);
        const start_time = dt.getTime() / 1000;

        const response = await axios.get(url)

        const { current, location } = response.data;
        const i = `https:${current.condition.icon}`;
        const it = `${current.condition.text}`;
        const w = `T: ${current.temp_c}°C H: ${current.humidity}% W: ${current.wind_kph} km/h`;
        const u = `${current.last_updated} ${location.region}`;

        console.log(`[INFO] [${it}]`)
        console.log(`[INFO] [${w}]`)
        console.log(`[INFO] [${u}]`)
        console.log(`[INFO] [${now}]`)

        client.setActivity({
            details: `${w}`,
            state: `${u}`,
            largeImageKey: i,
            largeImageText: it,
            startTimestamp: start_time,
            buttons: [
                {
                    label: "Powered by WeatherAPI.com",
                    url: "https://www.weatherapi.com/"
                }
            ]
        })
    } catch (error) {
        console.error("[ERROR] An error occurred Meow!:", error);
        client.setActivity({
            details: "[ERROR] An error occurred Meow!",
        })
    }
}

client.on('ready', async () => {
    console.log(`[INFO] RPC connected Meow! (${client.user.username})`);
    setActivity();

    function updateRPC() {
        const now = new Date();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        let ut = 0;

        if (minutes >= 53) {
            ut = (68 - minutes) * 60 - seconds;
        } else if (minutes >= 38) {
            ut = (53 - minutes) * 60 - seconds;
        } else if (minutes >= 23) {
            ut = (38 - minutes) * 60 - seconds;
        } else if (minutes >= 8) {
            ut = (23 - minutes) * 60 - seconds;
        } else {
            ut = (8 - minutes) * 60 - seconds;
        }

        setTimeout(() => {
            setActivity();
            updateRPC();
        }, ut * 1000);
    }

    updateRPC();
});

client.login({
    clientId: ClientID
})