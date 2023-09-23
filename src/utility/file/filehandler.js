/*  +--------------------------------------------------------------------------------+
    20230622
    liuzhen
    文件工具方法
    ----------------------------------------------------------------------------------
    https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
    +--------------------------------------------------------------------------------+  */

import * as P from '../math/precision'
import * as TF from '../time/format'

/** 最终要返回的文件们 */
const files = [];

/**
 * 文件类型
 */
export const FILE_TYPE = {
    /** 文件类型-图片 */
    image: 'image',
    /** 文件类型-音频 */
    audio: 'audio'
}

/**
 * 打开文件夹获取文件
 * @param {*} is_tree 是否允许打开树级结构
 * @param {*} file_type 选择文件后的回调函数
 * @param {*} maxCount 最多获取文件的个数
 */
export async function fetchFiles(is_tree, file_type, maxCount) {
    try {
        files.splice(0);
        await iterate_files(
            await window.showDirectoryPicker(),
            is_tree,
            file_type,
            maxCount
        );

        return files;
    } catch (e) {
        console.log(`# [ERROR] ${e}`);
    }
}

/**
 * 循环遍历文件夹下所有文件，将符合执行类型的文件写入返回数组
 * @param {*} dirHandle 选择的目录
 * @param {*} is_tree 是否允许打开树级结构
 * @param {*} file_type 要选择的文件类型
 */
async function iterate_files(dirHandle, is_tree, file_type, maxCount) {
    try {
        const promises = [];
        for await (let handle of dirHandle.entries()) {
            for await (let [k, v] of handle.entries()) {
                // 如果允许打开树级文件夹且当前元素是文件夹，继续迭代
                if (is_tree && v.kind === 'directory') {
                    await iterate_files(v, is_tree, file_type, maxCount);
                }

                // 如果是文件，读取该文件
                if (v.kind === 'file') {
                    const promise =
                        v.getFile().then(file => {
                            // 只将符合文件类型的文件添加到返回数组中
                            if (is_accord(file, file_type)) {
                                if (files.length < maxCount) {
                                    files.push(file);
                                } else {
                                    return;
                                }
                            }
                        }).catch(e => {
                            console.log(`# [ERROR] ${e}`)
                        });

                    if (promises.indexOf(promise) < 0) {
                        promises.push(promise);
                    }
                }
            }
            await Promise.all(promises);
        }
    } catch (e) {
        console.log(`# [ERROR] ${e}`);
    }
}

/**
 * 文件分析F
 * @param {*} file 
 */
export async function analysis_file(file) {
    console.log(`file:${file}`);
    console.log(`文件类型:${file.type}`);
    console.log(`最后更改:${TF.getTime(file.lastModifiedDate)}`);
    console.log(`文件名:${file.name}`);
    console.log(`文件大小:${P.round(file.size / 1024, 2)}K`);
}

/**
 * 获取磁盘信息
 */
export function get_diskinfo() {
    navigator.storage.estimate().then(function (estimate) {
        console.log("磁盘使用情况：", estimate.usage);
        console.log("磁盘配额：", estimate.quota);
    });

}

/**
 * 1KB 的大小
 */
const NUM_KB = 1024;

/**
 * 1MB 的大小
 */
const NUM_MB = NUM_KB * NUM_KB;

/**
 * 1GB 的大小
 */
const NUM_GB = NUM_KB * NUM_MB;

/**
 * 获取文件信息
 * @param {文件} file 
 */
export function getFileinfo(file) {
    if (!file) return [];

    return {
        /**
         * 资源URL string
         */
        src: URL.createObjectURL(file),
        /**
         * 文件名 string
         */
        name: file.name,
        /**
         * 文件大小 KB number
         */
        size_K: P.round(file.size / NUM_KB, 2),
        /**
         * 文件大小 MB number
         */
        size_M: P.round(file.size / NUM_MB, 2),
        /**
         * 文件大小 GB number
         */
        size_G: P.round(file.size / NUM_GB, 2),
        /**
         * 文件类型 string
         */
        type: file.type,
        /**
         * 最后更改时间 string
         */
        lastModifiedDate: `${TF.getTimeYMDhms(file.lastModifiedDate)}`,
    }
}


/**
 * 获取文件类型
 * @param {File} file 要判断文件类型的文件
 */
export function getFileType(file) {
    // file.type 不是很准确，详细的获取方法见 obsidian 笔记 
    // C:\Users\17862\OneDrive\note\develope\个人网站\客户端\Assistant\File\文件读取.md
}

/**
 * 获取多个文件的信息
 * @param {File[]} files 文件们
 */
export function getFileinfos(files) {
    if (!files) return [];

    const fileInfos = [];
    for (let file of files) {
        fileInfos.push(getFileinfo(file));
    }

    return fileInfos;
}

/**
 * 文件是否是音频类型
 * @param {*} file 判断文件
 */
export const is_audio = (file) => {
    return file && file.type && file.type.startsWith(FILE_TYPE.audio);
}

/**
 * 文件是否是音频类型
 * @param {*} file 判断文件
 */
export const is_image = (file) => {
    return file && file.type && file.type.startsWith(FILE_TYPE.image);
}

/**
 * 文件是否是符合指定类型
 * @param {*} file 判断文件
 * @param {*} file_type 指定的文件类型
 */
export const is_accord = (file, file_type) => {
    return file && file.type && file.type.startsWith(file_type);
}

