/**
 * 计算对象大小
 * 不确定这个算法对不对，我计算出来的好像不对
 * @param {*} object 
 * @returns 
 */
export const cal_size = (object) => {
    const objectList = [];
    const stack = [object];
    let bytes = 0;
    while (stack.length) {
        let value = stack.pop();

        if (typeof value === 'boolean') {
            bytes += 4;
        } else if (typeof value === 'string') {
            bytes += value.length * 2;
        } else if (typeof value === 'number') {
            bytes += 8;
        } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
            objectList.push(value);

            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }
    // console.log(bytes); // 输出对象的大致大小（字节数）
    return bytes;
}
