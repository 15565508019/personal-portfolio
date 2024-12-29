// LeanCloud 配置
AV.init({
    appId: "Rmjt9JQI4XIFDWolH1dBHMrx-MdYXbMMI",
    appKey: "QrB3uDAPxhmzPQKlGiVVcRuw",
    serverURL: "https://rmjt9jqi.api.lncldglobal.com"
});

// 提示：请在 LeanCloud 控制台获取域名
console.log("请在 LeanCloud 控制台的【应用凭证】中获取 REST API 服务器地址，并替换配置中的 serverURL");

// 创建全局数据库引用
window.db = {
    // 获取集合引用
    collection: function(collectionName) {
        return {
            doc: function(docId) {
                return {
                    // 获取文档
                    get: async function() {
                        try {
                            const query = new AV.Query(collectionName);
                            const result = await query.get(docId);
                            return {
                                exists: !!result,
                                data: function() {
                                    return result.toJSON();
                                }
                            };
                        } catch (error) {
                            console.error('Error getting document:', error);
                            return { exists: false };
                        }
                    },
                    // 更新文档
                    update: async function(data) {
                        try {
                            const obj = AV.Object.createWithoutData(collectionName, docId);
                            Object.keys(data).forEach(key => {
                                obj.set(key, data[key]);
                            });
                            await obj.save();
                        } catch (error) {
                            console.error('Error updating document:', error);
                            throw error;
                        }
                    },
                    // 设置文档
                    set: async function(data) {
                        try {
                            const obj = new AV.Object(collectionName);
                            obj.id = docId;
                            Object.keys(data).forEach(key => {
                                obj.set(key, data[key]);
                            });
                            await obj.save();
                        } catch (error) {
                            console.error('Error setting document:', error);
                            throw error;
                        }
                    }
                };
            },
            // 添加文档
            add: async function(data) {
                try {
                    const obj = new AV.Object(collectionName);
                    Object.keys(data).forEach(key => {
                        obj.set(key, data[key]);
                    });
                    const result = await obj.save();
                    return { id: result.id };
                } catch (error) {
                    console.error('Error adding document:', error);
                    throw error;
                }
            },
            // 获取集合数据
            orderBy: function(field, direction) {
                const query = new AV.Query(collectionName);
                query.addDescending(field);
                return {
                    get: async function() {
                        try {
                            const results = await query.find();
                            return {
                                forEach: function(callback) {
                                    results.forEach(doc => {
                                        callback({
                                            id: doc.id,
                                            data: function() {
                                                return doc.toJSON();
                                            }
                                        });
                                    });
                                }
                            };
                        } catch (error) {
                            console.error('Error getting documents:', error);
                            throw error;
                        }
                    }
                };
            }
        };
    }
};

// 文件存储服务
window.storage = {
    ref: function(path) {
        return {
            put: async function(file) {
                try {
                    const avFile = new AV.File(file.name, file);
                    const result = await avFile.save();
                    return {
                        getDownloadURL: async function() {
                            return result.url();
                        }
                    };
                } catch (error) {
                    console.error('Error uploading file:', error);
                    throw error;
                }
            }
        };
    }
}; 