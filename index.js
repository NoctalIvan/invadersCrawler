const axios = require('axios')
const fs = require('fs')

const get = async (city, page) =>
  axios.post("http://invader.spotter.free.fr/listing.php",
    "ville=" + city + "&arron=00&mode=lst&rang=10&page=1",
    {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "upgrade-insecure-requests": "1",
        "cookie": "didomi_token=eyJ1c2VyX2lkIjoiMTgwMDkyZTItZDZkYi02YjJkLThmMDctNjE1ZmZkOTE1ZGFkIiwiY3JlYXRlZCI6IjIwMjMtMDEtMTdUMTY6Mjc6MDkuOTk5WiIsInVwZGF0ZWQiOiIyMDIzLTAxLTE3VDE2OjI3OjA5Ljk5OVoiLCJ2ZXJzaW9uIjoyLCJwdXJwb3NlcyI6eyJlbmFibGVkIjpbImRldmljZV9jaGFyYWN0ZXJpc3RpY3MiLCJnZW9sb2NhdGlvbl9kYXRhIl19LCJ2ZW5kb3JzIjp7ImVuYWJsZWQiOlsidHdpdHRlciIsImdvb2dsZSIsImM6Y3JhenktZWdnIiwiYzpnb29nbGVhbmEtNFRYbkppZ1IiLCJjOnBpd2lrcHJvIl19LCJ2ZW5kb3JzX2xpIjp7ImVuYWJsZWQiOlsiZ29vZ2xlIl19LCJhYyI6IkNneUFFQUZrRkJnQS5DZ3lBQ0NndyJ9; euconsent-v2=CPluvIAPluvIAAHABBENCzCsAP_AAH_AAAqIIqNf_X__b2_j-_5_f_t0eY1P9_7__-0zjhfdl-8N3f_X_L8X42M7vF36pq4KuR4Eu3LBIQdlHOHcTUmw6okVryPsbk2cr7NKJ7PEmnMbOydYGH9_n13TuZKY7___f_7z_v-v_v____f_7-3f3__5_3---_e_V_99zbn9____39nP___9v-_9_______BFMAkw1LiALsSxwZNowigRAjCsJDqBQAUUAwtEBhA6uCnZXAT6ggQAIBQBGBECDAFGDAIAAAIAkIiAkAPBAIACIBAACABUAhAARsAgsALAwCAAUA0LECKAIQJCDIgIilMCAiRIKCeyoQSg70NMIQyywAoFH9FQgIlACBYEQkLByHAEgJcLJAsxQvkAIwAAAAA.f_gAD_gAAAAA; _scid=53620d2e-7848-445d-b481-d8fb6b63cf4b; PHPSESSID=74adf0d786e8b7f4aca0588dacc4198b",
        "Referer": "http://invader.spotter.free.fr/choixville.php",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
    })

const getPages = async () => {
  const pageCpt = 30
  const city = "PA"

  const pages = []
  for (let i = 1; i <= pageCpt; i++) {
    console.log('page', i, 'of', pageCpt)
    const response = await get(city, i)
    const text = response.data.replace(/\n/g, "")
    pages.push(text)
  }

  return pages
}

const parsePage = (page) => {
  // isolate <tr class="haut">
  const reg = /<tr class="haut">(.*?)<\/tr>/g

  // get all matches
  const invaders = []
  const matches = page.match(reg)
  matches.forEach(m => {
    const name = m.match(/<b>(.*)<\/b>/)[1].split(' ')[0]
    const status = m.match(/<img src='images\/(.*)'/)[1].split('.')[0].split('spot_invader_')[1]
    invaders.push({name, status})
  })

  return invaders
}

const main = async () => {
  const pages = await getPages()
  const invaders = pages.map(p => parsePage(p)).flat()
  
  fs.writeFileSync('invaders.json', JSON.stringify(invaders))
  console.log('done')
}

main()