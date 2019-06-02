"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importStar(require("mongodb"));
const _ = __importStar(require("lodash"));
class MongoDB {
    constructor(conf, logger) {
        this.logger = logger;
        this.conf = conf;
        this.safeData = true;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.conf
                    || !this.conf.url
                    || !this.conf.auth
                    || !this.conf.auth.user
                    || !this.conf.auth.password
                    || !this.conf.dbName
                    || !this.conf.port) {
                    this.logger.warn('MongoDB: No parameters for initialization. Skiping...');
                    return;
                }
                const mongoOpts = {
                    auth: _.get(this.conf, 'auth', null),
                    authSource: this.conf.dbName,
                    keepAlive: true,
                    useNewUrlParser: true,
                };
                const url = `${this.conf.url}:${this.conf.port}`;
                this.client = yield mongodb_1.default.MongoClient.connect(url, mongoOpts);
                this.db = this.client.db(this.conf.dbName);
                this.logger.ok('MongoDB initialized...');
            }
            catch (error) {
                this.logger.error('MongoDB initialization failed: ', error.message);
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client && (yield this.client.close());
        });
    }
    getDBInstance(retry = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db) {
                return this.db;
            }
            if (!retry) {
                yield this.init();
                return this.getDBInstance(true);
            }
            throw new Error('Unable to connect.');
        });
    }
    getClientInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client) {
                return this.client;
            }
            yield this.init();
            return this.getClientInstance();
        });
    }
    isConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getClientInstance();
            return client.isConnected();
        });
    }
    findDocumentById(collection, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDBInstance();
            const coll = db.collection(collection);
            // Find some documents
            const doc = yield coll.findOne({ _id: new mongodb_1.ObjectID(id) });
            return this.transsformData(doc);
        });
    }
    findAllDocuments(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDBInstance();
            const coll = db.collection(collection);
            // Find some documents
            const docs = yield coll.find({}).toArray();
            return this.transsformData(docs || []);
        });
    }
    findAllDocumentsByQuery(collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDBInstance();
            const coll = db.collection(collection);
            // Find some documents
            const docs = yield coll.find(query).toArray();
            return this.transsformData(docs || []);
        });
    }
    updateDocument(collection, query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDBInstance();
            const coll = db.collection(collection);
            yield coll.updateOne(query, { $set: data });
            return yield this.findAllDocumentsByQuery(collection, query);
        });
    }
    updateDocumentById(collection, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDBInstance();
            const coll = db.collection(collection);
            yield coll.updateOne({ _id: new mongodb_1.ObjectID(id) }, { $set: _.omit(data, '_id') });
            return yield this.findDocumentById(collection, id);
        });
    }
    insertDocument(collection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDBInstance();
            const coll = db.collection(collection);
            if (_.has(data, '_id')) {
                data._id = new mongodb_1.ObjectID(data._id);
            }
            const result = yield coll.insertOne(data);
            return this.transsformData(result.ops[0]);
        });
    }
    insertDocuments(collection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDBInstance();
            const coll = db.collection(collection);
            const result = yield coll.insertMany(data);
            return this.transsformData(result.ops);
        });
    }
    deleteDocument(collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDBInstance();
            const coll = db.collection(collection);
            yield coll.deleteOne(query);
            return;
        });
    }
    deleteDocuments(collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDBInstance();
            const coll = db.collection(collection);
            yield coll.deleteMany(query);
            return;
        });
    }
    dropCollection(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDBInstance();
            yield db.collection(collection).drop();
        });
    }
    transsformData(data) {
        if (this.safeData) {
            return JSON.parse(JSON.stringify(data));
        }
        return data;
    }
}
exports.default = MongoDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uZ28uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9uZ28vTW9uZ28udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtREFBNEM7QUFDNUMsMENBQTRCO0FBSzVCLE1BQXFCLE9BQU87SUFTMUIsWUFBWSxJQUF3QixFQUFFLE1BQWM7UUFDbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVZLElBQUk7O1lBQ2YsSUFBSTtnQkFDRixJQUNLLENBQUMsSUFBSSxDQUFDLElBQUk7dUJBQ1YsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUc7dUJBQ2QsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7dUJBQ2YsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO3VCQUNwQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7dUJBQ3hCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO3VCQUNqQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUNsQjtvQkFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO29CQUMxRSxPQUFPO2lCQUNSO2dCQUNELE1BQU0sU0FBUyxHQUErQjtvQkFDNUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDO29CQUNwQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO29CQUM1QixTQUFTLEVBQUUsSUFBSTtvQkFDZixlQUFlLEVBQUUsSUFBSTtpQkFDdEIsQ0FBQztnQkFDRixNQUFNLEdBQUcsR0FBRyxH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QWtCLEVBQUUsS0FBVTs7WUFDekQsTUFBTSxFQUFFLEdBQWUsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFbEQsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUV2QyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFN0IsT0FBTztRQUNULENBQUM7S0FBQTtJQUVZLGNBQWMsQ0FBQyxVQUFrQjs7WUFDNUMsTUFBTSxFQUFFLEdBQWUsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFbEQsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pDLENBQUM7S0FBQTtJQUVPLGNBQWMsQ0FBQyxJQUFTO1FBQzlCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFuTEQsMEJBbUxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvZGIsIHsgT2JqZWN0SUQgfSBmcm9tICdtb25nb2RiJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgTW9uZ29Db25maWd1cmF0aW9uIH0gZnJvbSAnLi4vdXRpbHMvU2VydmljZUNvbmYnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuLi91dGlscy9Mb2dnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb25nb0RCIHtcbiAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcjtcbiAgcHJpdmF0ZSBjb25mOiBNb25nb0NvbmZpZ3VyYXRpb247XG5cbiAgcHJpdmF0ZSBzYWZlRGF0YTogYm9vbGVhbjtcblxuICBwcml2YXRlIGNsaWVudD86IG1vbmdvZGIuTW9uZ29DbGllbnQ7XG4gIHByaXZhdGUgZGI/OiBtb25nb2RiLkRiO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmY6IE1vbmdvQ29uZmlndXJhdGlvbiwgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICB0aGlzLmNvbmYgPSBjb25mO1xuICAgIHRoaXMuc2FmZURhdGEgPSB0cnVlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGluaXQoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChcbiAgICAgICAgICAgIXRoaXMuY29uZlxuICAgICAgICB8fCAhdGhpcy5jb25mLnVybFxuICAgICAgICB8fCAhdGhpcy5jb25mLmF1dGhcbiAgICAgICAgfHwgIXRoaXMuY29uZi5hdXRoLnVzZXJcbiAgICAgICAgfHwgIXRoaXMuY29uZi5hdXRoLnBhc3N3b3JkXG4gICAgICAgIHx8ICF0aGlzLmNvbmYuZGJOYW1lXG4gICAgICAgIHx8ICF0aGlzLmNvbmYucG9ydFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ01vbmdvREI6IE5vIHBhcmFtZXRlcnMgZm9yIGluaXRpYWxpemF0aW9uLiBTa2lwaW5nLi4uJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1vbmdvT3B0czogbW9uZ29kYi5Nb25nb0NsaWVudE9wdGlvbnMgPSB7XG4gICAgICAgIGF1dGg6IF8uZ2V0KHRoaXMuY29uZiwgJ2F1dGgnLCBudWxsKSxcbiAgICAgICAgYXV0aFNvdXJjZTogdGhpcy5jb25mLmRiTmFtZSxcbiAgICAgICAga2VlcEFsaXZlOiB0cnVlLFxuICAgICAgICB1c2VOZXdVcmxQYXJzZXI6IHRydWUsXG4gICAgICB9O1xuICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy5jb25mLnVybH06JHt0aGlzLmNvbmYucG9ydH1gO1xuXG4gICAgICB0aGlzLmNsaWVudCA9IGF3YWl0IG1vbmdvZGIuTW9uZ29DbGllbnQuY29ubmVjdCh1cmwsIG1vbmdvT3B0cyk7XG4gICAgICB0aGlzLmRiID0gdGhpcy5jbGllbnQuZGIodGhpcy5jb25mLmRiTmFtZSk7XG5cbiAgICAgIHRoaXMubG9nZ2VyLm9rKCdNb25nb0RCIGluaXRpYWxpemVkLi4uJyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdNb25nb0RCIGluaXRpYWxpemF0aW9uIGZhaWxlZDogJywgZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGNsb3NlKCkge1xuICAgIHJldHVybiB0aGlzLmNsaWVudCAmJiBhd2FpdCB0aGlzLmNsaWVudC5jbG9zZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXREQkluc3RhbmNlKHJldHJ5ID0gZmFsc2UpOiBQcm9taXNlPG1vbmdvZGIuRGI+IHtcbiAgICBpZiAodGhpcy5kYikge1xuICAgICAgcmV0dXJuIHRoaXMuZGI7XG4gICAgfVxuICAgIGlmICghcmV0cnkpIHtcbiAgICAgIGF3YWl0IHRoaXMuaW5pdCgpO1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0REJJbnN0YW5jZSh0cnVlKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY29ubmVjdC4nKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2V0Q2xpZW50SW5zdGFuY2UoKTogUHJvbWlzZTxtb25nb2RiLk1vbmdvQ2xpZW50PiB7XG4gICAgaWYgKHRoaXMuY2xpZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5jbGllbnQ7XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuaW5pdCgpO1xuICAgIHJldHVybiB0aGlzLmdldENsaWVudEluc3RhbmNlKCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaXNDb25uZWN0ZWQoKSB7XG4gICAgY29uc3QgY2xpZW50OiBtb25nb2RiLk1vbmdvQ2xpZW50ID0gYXdhaXQgdGhpcy5nZXRDbGllbnRJbnN0YW5jZSgpO1xuICAgIHJldHVybiBjbGllbnQuaXNDb25uZWN0ZWQoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBmaW5kRG9jdW1lbnRCeUlkKGNvbGxlY3Rpb246IHN0cmluZywgaWQ6IHN0cmluZyB8IG51bWJlcik6IFByb21pc2U8YW55IHwgbnVsbD4ge1xuICAgIGNvbnN0IGRiOiBtb25nb2RiLkRiID0gYXdhaXQgdGhpcy5nZXREQkluc3RhbmNlKCk7XG5cbiAgICBjb25zdCBjb2xsID0gZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKTtcbiAgICAvLyBGaW5kIHNvbWUgZG9jdW1lbnRzXG4gICAgY29uc3QgZG9jID0gYXdhaXQgY29sbC5maW5kT25lKHsgX2lkOiBuZXcgT2JqZWN0SUQoaWQpIH0pO1xuICAgIHJldHVybiB0aGlzLnRyYW5zc2Zvcm1EYXRhKGRvYyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZmluZEFsbERvY3VtZW50cyhjb2xsZWN0aW9uOiBzdHJpbmcpOiBQcm9taXNlPGFueVtdPiB7XG4gICAgY29uc3QgZGI6IG1vbmdvZGIuRGIgPSBhd2FpdCB0aGlzLmdldERCSW5zdGFuY2UoKTtcblxuICAgIGNvbnN0IGNvbGwgPSBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pO1xuICAgIC8vIEZpbmQgc29tZSBkb2N1bWVudHNcbiAgICBjb25zdCBkb2NzID0gYXdhaXQgY29sbC5maW5kKHt9KS50b0FycmF5KCk7XG5cbiAgICByZXR1cm4gdGhpcy50cmFuc3Nmb3JtRGF0YShkb2NzIHx8IFtdKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBmaW5kQWxsRG9jdW1lbnRzQnlRdWVyeShjb2xsZWN0aW9uOiBzdHJpbmcsIHF1ZXJ5OiBhbnkpOiBQcm9taXNlPGFueVtdPiB7XG4gICAgY29uc3QgZGI6IG1vbmdvZGIuRGIgPSBhd2FpdCB0aGlzLmdldERCSW5zdGFuY2UoKTtcblxuICAgIGNvbnN0IGNvbGwgPSBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pO1xuICAgIC8vIEZpbmQgc29tZSBkb2N1bWVudHNcbiAgICBjb25zdCBkb2NzID0gYXdhaXQgY29sbC5maW5kKHF1ZXJ5KS50b0FycmF5KCk7XG5cbiAgICByZXR1cm4gdGhpcy50cmFuc3Nmb3JtRGF0YShkb2NzIHx8IFtdKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB1cGRhdGVEb2N1bWVudChjb2xsZWN0aW9uOiBzdHJpbmcsIHF1ZXJ5OiBhbnksIGRhdGE6IGFueSk6IFByb21pc2U8YW55W10+IHtcbiAgICBjb25zdCBkYjogbW9uZ29kYi5EYiA9IGF3YWl0IHRoaXMuZ2V0REJJbnN0YW5jZSgpO1xuXG4gICAgY29uc3QgY29sbCA9IGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbik7XG5cbiAgICBhd2FpdCBjb2xsLnVwZGF0ZU9uZShxdWVyeSwgeyAkc2V0OiBkYXRhIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZmluZEFsbERvY3VtZW50c0J5UXVlcnkoY29sbGVjdGlvbiwgcXVlcnkpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHVwZGF0ZURvY3VtZW50QnlJZChjb2xsZWN0aW9uOiBzdHJpbmcsIGlkOiBzdHJpbmcgfCBudW1iZXIsIGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgZGI6IG1vbmdvZGIuRGIgPSBhd2FpdCB0aGlzLmdldERCSW5zdGFuY2UoKTtcblxuICAgIGNvbnN0IGNvbGwgPSBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pO1xuXG4gICAgYXdhaXQgY29sbC51cGRhdGVPbmUoeyBfaWQ6IG5ldyBPYmplY3RJRChpZCkgfSwgeyAkc2V0OiBfLm9taXQoZGF0YSwgJ19pZCcpIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZmluZERvY3VtZW50QnlJZChjb2xsZWN0aW9uLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5zZXJ0RG9jdW1lbnQoY29sbGVjdGlvbjogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBkYjogbW9uZ29kYi5EYiA9IGF3YWl0IHRoaXMuZ2V0REJJbnN0YW5jZSgpO1xuXG4gICAgY29uc3QgY29sbCA9IGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbik7XG5cbiAgICBpZiAoXy5oYXMoZGF0YSwgJ19pZCcpKSB7XG4gICAgICBkYXRhLl9pZCA9IG5ldyBPYmplY3RJRChkYXRhLl9pZCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY29sbC5pbnNlcnRPbmUoZGF0YSk7XG5cbiAgICByZXR1cm4gdGhpcy50cmFuc3Nmb3JtRGF0YShyZXN1bHQub3BzWzBdKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpbnNlcnREb2N1bWVudHMoY29sbGVjdGlvbjogc3RyaW5nLCBkYXRhOiBhbnlbXSkge1xuICAgIGNvbnN0IGRiOiBtb25nb2RiLkRiID0gYXdhaXQgdGhpcy5nZXREQkluc3RhbmNlKCk7XG5cbiAgICBjb25zdCBjb2xsID0gZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbGwuaW5zZXJ0TWFueShkYXRhKTtcblxuICAgIHJldHVybiB0aGlzLnRyYW5zc2Zvcm1EYXRhKHJlc3VsdC5vcHMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGRlbGV0ZURvY3VtZW50KGNvbGxlY3Rpb246IHN0cmluZywgcXVlcnk6IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGRiOiBtb25nb2RiLkRiID0gYXdhaXQgdGhpcy5nZXREQkluc3RhbmNlKCk7XG5cbiAgICBjb25zdCBjb2xsID0gZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKTtcblxuICAgIGF3YWl0IGNvbGwuZGVsZXRlT25lKHF1ZXJ5KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkZWxldGVEb2N1bWVudHMoY29sbGVjdGlvbjogc3RyaW5nLCBxdWVyeTogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZGI6IG1vbmdvZGIuRGIgPSBhd2FpdCB0aGlzLmdldERCSW5zdGFuY2UoKTtcblxuICAgIGNvbnN0IGNvbGwgPSBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pO1xuXG4gICAgYXdhaXQgY29sbC5kZWxldGVNYW55KHF1ZXJ5KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkcm9wQ29sbGVjdGlvbihjb2xsZWN0aW9uOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYjogbW9uZ29kYi5EYiA9IGF3YWl0IHRoaXMuZ2V0REJJbnN0YW5jZSgpO1xuXG4gICAgYXdhaXQgZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKS5kcm9wKCk7XG4gIH1cblxuICBwcml2YXRlIHRyYW5zc2Zvcm1EYXRhKGRhdGE6IGFueSkge1xuICAgIGlmICh0aGlzLnNhZmVEYXRhKSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG59XG4iXX0=