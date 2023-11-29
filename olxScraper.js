
const axios = require('axios');
const cheerio = require('cheerio');
var fs2 = require('fs');
main();
async function main(){
    console.log("Tecnologia e informática-consolas, Moita + 15KM");
    let url = 'https://www.olx.pt/tecnologia-e-informatica/videojogos-consolas/consolas/moita-setubal/?search%5Bdist%5D=15&search%5Border%5D=filter_float_price:asc&page=';
    await findIt(url, "consolas.txt");

    console.log("Tecnologia e informática-cameras e objetivas, Moita + 15KM");
    let url2 = "https://www.olx.pt/tecnologia-e-informatica/fotografia-tv-som/fotografia/moita-setubal/?search%5Bdist%5D=15&search%5Bfilter_enum_tipo%5D%5B0%5D=maquinas-fotograficas-reflex&search%5Bfilter_enum_tipo%5D%5B1%5D=maquinas-fotograficas&search%5Bfilter_enum_tipo%5D%5B2%5D=objectivas&page=";
   await findIt(url2,"cameras.txt")
    console.log("Done!");
}
async function findIt(url,path) {


    //let url = 'https://www.olx.pt/tecnologia-e-informatica/videojogos-consolas/moita-setubal/?search%5Bdist%5D=15&page=';

    fs2.unlink(path, function (err) {
        if (err) console.log("bruh");
        console.log('File deleted!');
    });

    for (let page = 0; page <= 10; page++) {
        let url2 = url + page;
        const htmlContent = await fetchHTMLFromWebsite(url2);
        if (htmlContent) {
            const lines = htmlContent.split('\n');

            let data = extractInfoFromAd(htmlContent);
            writeToFile(data,path)

        } else {
            console.log('Failed to fetch website HTML content');
        }
    }
}




//_____________________________________________
async function fetchHTMLFromWebsite(url) { // retreives HTML content from a given URL
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


//_____________________________________________
function extractInfoFromAd(htmlContent) { //given the HTML content of the webpage, extracts the wanted info!
    const $ = cheerio.load(htmlContent);

    const adElements = $('.css-1apmciz');

    const adInfo = adElements.map((index, element) => {
        const nameElement = $(element).find('h6.css-16v5mdi'); // Replace with the actual class of the name element
        const name = nameElement.text().trim();

        const priceElement = $(element).find('p[data-testid="ad-price"]');
        const price = priceElement.text().trim();
        const negotiable = priceElement.find('span').text().trim() === 'Negociável';
        const description = $(element).find()
        const locationDate = $(element).find('p[data-testid="location-date"]').text().trim();

        // Extracting the link if available
        const linkElement = nameElement.closest('a'); // Assuming the link is within an anchor tag
        const link = linkElement.attr('href') || ''; // Get the href attribute, or an empty string if not found

        return { name, price, negotiable, locationDate, link };
    }).get();

    return adInfo;
}
//_________________________________________________________
//writes to the file the following the given template
async function writeToFile(data, path) {

    data.forEach(it => {
        let cont = `${it.name}\n ${it.price}\n ${it.negotiable}\n ${it.locationDate} \n https://www.olx.pt${it.link}\n\n`;
        fs2.appendFile(path, cont, function (err) {
            if (err) throw err;
        });
    });
}
