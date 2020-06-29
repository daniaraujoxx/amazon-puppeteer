const puppeteer = require('puppeteer');
const fs = require('fs');

const getInfo = async() => {  
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto('https://www.amazon.com.br/')

    const url = await page.evaluate(() => {
        var str = prompt('Digite o nome do produto')
        var produto = str.replace('', '+');
        var url = "https://www.amazon.com.br/s?k=" + produto
        return url
    })

    await page.goto(url)
    //await page.goto('https://www.amazon.com.br/s?k=echo+dot')
    //await page.goto(url)
    await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});
    
    const links = await page.evaluate(() => {
        var tam = $(".a-size-base.a-link-normal.a-text-normal").length
        var links_produtos = []
        
        for (var i = 0; i < tam; i++) {
            links_produtos[i] = $(".a-size-base.a-link-normal.a-text-normal")[i].href
        }
        return links_produtos
    })
    
    var content = ''
    var separador = ''
    var produtos = []
    for(var y = 0; y < links.length; y++) {
    
        await page.goto(links[y]);
           
        const produto = await page.evaluate(() => {
                var produto = {}
                produto.name = []
                produto.price = []
                
                var nome_produto = ''
                var valor_produto = ''
                try {
                    nome_produto = document.querySelector("#productTitle").innerText
                } catch (e) {
                  console.log(e);
                }
                try {
                    valor_produto = document.querySelector("#priceblock_ourprice").innerText
                } catch (e) {
                  console.log(e);
                }
                
                if (!nome_produto) {
                    produto.name.push ({ nome: 'Nome não encontrado'})
                } else {
                    produto.name.push({ nome: nome_produto})
                }
                
                if (!valor_produto) {
                    produto.price.push ({ preco: 'Preço não encontrado'}) 
                } else {
                    produto.price.push ({ preco: valor_produto})
                }

                return produto
        })
        produtos[y] = produto
        await page.goBack()
    }
    
      for(i = 0; i  < produtos.length; i++){
          i < produtos.length ? separador = '; ' : ''
          content += produtos[i].name[0].nome  + separador + produtos[i].price[0].preco  + separador + '\n'
      }
    //console.log(produtos)
    console.log(content)
    gravaCsv(content)
    name
    await browser.close()
}

function gravaCsv(content){
    contentFilePath = 'lista_produtos.csv'
    const contentString = content
    return fs.writeFileSync(contentFilePath, contentString, function(erro) {
       if(erro) {
            throw erro;
        }
       console.log("Arquivo salvo");
    });
}

getInfo()