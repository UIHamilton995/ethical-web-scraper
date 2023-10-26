import http, { IncomingMessage, Server, ServerResponse } from "http";
import puppeteer from 'puppeteer'

/*
implement your server code here
*/

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
 
      let data = "";

      req.on("data", (chunk)=>{
        data += chunk;
      })

      req.on("end", async ()=>{
        let {url} = JSON.parse(data)

        const datas = await puppeteer.launch({
          headless: false,
          defaultViewport: null,
        });
        // opening a new page 
        const page = await datas.newPage();

        // On this new page:
        // - open the "http://quotes.toscrape.com/" website
        // - wait until the dom content is loaded (HTML is ready)
        await page.goto(url)
        // Get page data
        const title = await page.title();

        const description = await page.evaluate(() => {
          // Fetch the first element with class "quote"
          // Get the displayed text and returns it
          const metaDesc = document.querySelector("meta[name = 'description']");
          return metaDesc ? metaDesc.getAttribute("content") : ""
      });
      
            const images = await page.evaluate(()=>{
            const link = Array.from(document.querySelectorAll("img")).map((p)=> p.getAttribute("src"))
            return link
          }) 

          let result ={
            title : title,
            description : description,
            images: images
          } 

          await res.writeHead(200,{
            "Content-Type": "application/json"            
          })
          res.end(JSON.stringify({
            success : true,
            result : result
          }))
          if (req.method === "GET" && req.url === "/data") 
          return result
        });

    }
)

server.listen(3001, ()=> console.log(`server is running on port 3001`));