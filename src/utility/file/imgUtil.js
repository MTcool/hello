import * as filehandler from '../../utility/file/filehandler'
import * as time from '../../utility/time/time'

/**
 * 默认图片宽度
 */
const defaultWidth = 240;

/**
 * 获取缩略图大小
 * @param {*} url  缩略图 url
 * @returns 
 */
export const getThunmbnailSize = (url) => Math.round((url.length * 3 / 4) / 1024);

/*  ------------------------------------ 获取图片信息相关 -------------------------------- */

/** 用于裁剪缩略图的canvas */
const canvas = document.createElement('canvas');
/** canvas的容器 */
const canvasContext2d = canvas.getContext('2d', { alpha: false });

/**
 * 完善图片文件的信息
 * @param {*} imginfo 图片文件信息
 * @returns 
 */
export const refine_img_info = (imginfo) => {
    if (!imginfo) return [];

    return new Promise((resolve, reject) => {
        const img = new Image(); // 临时图片元素
        img.src = imginfo.src;

        img.onload = function () {
            // console.log('------------------------------------------------------------------------------------------------------------------------');
            // 图片的宽
            imginfo.naturalWidth = img.width;
            // 图片的高
            imginfo.naturalHeight = img.height;
            // 图片的宽高比
            imginfo.heightWidthRatio = img.height / img.width;
            
            // const start = time.getYYYYMMDDhhmmssmmm().replaceAll(' ', '');
            // 如果图片的宽大于给定的阈值（默认为 defaultWidth） 且不为 gif 则裁剪图片
            if (img.width > defaultWidth && imginfo.type !== 'image/gif') {
                // 绘制 canvas
                canvas.width = defaultWidth;
                canvas.height = defaultWidth * (img.height / img.width);

                // console.log(`${parseFloat(time.getYYYYMMDDhhmmssmmm().replaceAll(' ', '')) - parseFloat(start)}ms`.padStart(115, ' '));

                // 将图片绘制到canvas上
                canvasContext2d.drawImage(img, 0, 0, canvas.width, canvas.height);

                // console.log(`${parseFloat(time.getYYYYMMDDhhmmssmmm().replaceAll(' ', '')) - parseFloat(start)}ms`.padStart(115, ' '));

                // 缩略图 url，默认图片为 png，可以通过指定图片格式 image/jpeg 来降低生成的文件质量
                imginfo.thumbnailSrc = canvas.toDataURL("image/jpeg");
                imginfo.thumbnail = true; // 是否有缩略图
                imginfo.thumbnailSize = getThunmbnailSize(imginfo.thumbnailSrc); // 缩略图大小

                // console.log(`${parseFloat(time.getYYYYMMDDhhmmssmmm().replaceAll(' ', '')) - parseFloat(start)}ms`.padStart(115, ' '));

                // canvas.toBlob((blob) => {
                //     imginfo.thumbnailSrc = URL.createObjectURL(blob);
                //     resolve(imginfo);
                // }, "image/jpeg");

                // const name = imginfo.name.padStart(50, ' ');
                // const size_K = `${imginfo.size_K}`.padStart(10, ' ');
                // const originalSize = `[${img.width}, ${img.height}]`.padStart(15, ' ');
                // const cropSize = `[${canvas.width}, ${canvas.height}]`.padStart(15, ' ');
                // const thunbnailSize = `${imginfo.thumbnailSize}`.padStart(10, ' ');
                // const costTime = `${parseFloat(time.getYYYYMMDDhhmmssmmm().replaceAll(' ', '')) - parseFloat(start)}ms`.padStart(10, ' ');

                // console.log(`${costTime}`);
                // console.log(`${name} ${size_K} ${originalSize} ${cropSize} ${thunbnailSize} ${costTime}`);
            } else {
                imginfo.thumbnailSrc = imginfo.src; // 缩略图 url 为他自己本身
                imginfo.thumbnail = false; // 是否有缩略图
            }

            resolve(imginfo);
        }
    });
}

/**
 * 根据文件完善文件的图片信息
 * @param {*} fileinfo 文件信息
 * @returns 
 */
export const refineImgByfile = async (files) => {
    if (!files) return [];

    return new Promise(async (resolve, reject) => {
        let imgInfos = []; // 最重要返回的所有的图片信息
        const fileinfos = filehandler.getFileinfos(files); // 获取文件信息
        // 根据文件信息补充图片信息
        const promise = refine_img_byinfos(fileinfos).then((infos) => {
            imgInfos = infos;
        });

        await Promise.resolve(promise);

        resolve(imgInfos);
    });
}

/**
 * 根据文件信息完善文件的图片信息
 * @param {*} fileinfo 文件信息
 * @returns 
 */
export const refine_img_byinfos = async (fileinfos) => {
    if (!fileinfos) return [];

    return new Promise(async (resolve, reject) => {
        const imgInfos = []; // 最终要返回的所有的图片信息
        const promises = [];
        for (const fileinfo of fileinfos) {
            const promise = refine_img_info(fileinfo).then((imginfo) => {
                imgInfos.push(imginfo);
            });

            promises.push(promise);
        }

        await Promise.all(promises);

        resolve(imgInfos);
    });
}

