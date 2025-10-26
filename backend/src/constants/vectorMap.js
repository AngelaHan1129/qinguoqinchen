// src/constants/vectorMap.js
const defaultVectorMap = {
    A1: { model: 'StyleGAN3', scenario: '高擬真臉部', successRate: 78 },
    A2: { model: 'StableDiffusion', scenario: '螢幕翻拍攻擊', successRate: 65 },
    A3: { model: 'SimSwap', scenario: '即時換臉', successRate: 89 },
    A4: { model: 'DiffusionGAN', scenario: '偽造護照', successRate: 73 },
    A5: { model: 'DALL·E', scenario: '生成假證件', successRate: 82 }
};
module.exports = defaultVectorMap;
