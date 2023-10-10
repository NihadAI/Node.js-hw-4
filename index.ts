import newspostTable from "./src/models/newsPosts";



async function test() {
    console.log( (await newspostTable).schemaName);
}

test()