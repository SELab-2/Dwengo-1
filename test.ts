async function test() {
    return 1+1;
}

for (let index = 0; index < 100; index++) {
        await test();
    let a = 10;
}