async function test_Function() {
    return 1 + 1;
}

for (let index = 0; index < 100; index++) {
    await test_Function();
    const a = 'test';
}
