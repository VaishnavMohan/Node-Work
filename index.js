const fs = require('fs');
const http = require('http');
const url = require('url');



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
    const dataObj = JSON.parse(data);

  

// const textIN = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIN);


// const textOUT = `This is what we know about the avacado : ${textIN}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOUT);
// console.log('File Written');


// fs.readFile(`./txt/start.txt`, 'utf-8', (err,data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8',(err,data2) => {
//     console.log(data2);

//     fs.writeFile('./txt/final.txt','utf-8', `${data2}`, err=>{
//         console.log("File Written");
//     });
// } );
// } );

const replaceTemplate = (temp, product) => {
    let outPut = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    outPut = outPut.replace(/{%IMAGE%}/g, product.image)
    outPut = outPut.replace(/{%PRICE%}/g, product.price)
    outPut = outPut.replace(/{%FROM%}/g, product.from)
    outPut = outPut.replace(/{%NUTRIENTS%}/g, product.nutrients)
    outPut = outPut.replace(/{%QUANTITY%}/g, product.quantity)
    outPut = outPut.replace(/{%DESCRIPTION%}/g, product.description)
    outPut = outPut.replace(/{%ID%}/g, product.id)
 console.log(product.organic);
    if (product.organic)
        outPut = outPut.replace(/{%NOT_ORGANIC%}/g, 'non-organic');
    return outPut
}


const server = http.createServer((req, res)=>{
    // console.log(req.url);
const {query, pathname} = url.parse(req.url, true);
//overview

if(pathname === '/' || pathname === '/overview'){
    res.writeHead(200, {'Content-type': 'text/html'});

const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el))
.join(``);
const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output); 

//product   
    
}else if(pathname === '/product') {
    res.writeHead(200, {'Content-type': 'text/html'});
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // console.log(query);
    // res.end(' This is prodcut');
//api 
    
}else if(pathname === '/api'){
    res.writeHead(200, {'Content-type': 'application/json'});
      res.end(data);

//api

}else{
res.writeHead(404,{
    'Content-type' : 'text/html',
    'my-own-header' : 'hello-world'
  }  );
  res.end('<h1> Page not Found </h1>');
}
});

server.listen(8000, '127.0.0.1', ()=>{
    console.log('Listening to reqest on port 8000');
});