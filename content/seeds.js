(()=>{
const regions={central:['الوسطى','Central'],western:['الغربية','Western'],eastern:['الشرقية','Eastern'],southern:['الجنوبية','Southern'],northern:['الشمالية','Northern']};
const topics={food:['الطعام','Food'],clothing:['الملابس','Clothing'],transport:['التنقل','Transport'],trade:['التجارة','Trade'],leisure:['الترفيه','Leisure']};
const periods={past:['الماضي البعيد','Distant past'],kingdom:['بدايات التأسيس','Early Kingdom'],mid:['منتصف القرن العشرين','Mid-20th century'],modern:['العصر الحديث','Modern era']};
// Only the existing interactive content is published by content/store.js.
// Regional sample articles are omitted until actual content is ready.
const seeds=[];

window.IyabContentSeed={regions,periods,topics,seeds};
})();
