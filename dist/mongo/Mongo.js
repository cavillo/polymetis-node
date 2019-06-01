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
                const mongoOpts = {
                    auth: this.conf.auth,
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
                this.logger.error('MongoDB failed: ', error.message);
                throw error;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uZ28uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9uZ28vTW9uZ28udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtREFBNEM7QUFDNUMsMENBQTRCO0FBSzVCLE1BQXFCLE9BQU87SUFTMUIsWUFBWSxJQUF3QixFQUFFLE1BQWM7UUFDbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVZLElBQUk7O1lBQ2YsSUFBSTtnQkFDRixNQUFNLFNBQVMsR0FBK0I7b0JBQzVDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7b0JBQ3BCLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07b0JBQzVCLFNBQVMsRUFBRSxJQUFJO29CQUNmLGVBQWUsRUFBRSxJQUFJO2lCQUN0QixDQUFDO2dCQUNGLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFFakQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLGlCQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ2hFLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQzthQUMxQztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLEtBQUss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QVM7UUFDOUIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDekM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQXhLRCwwQkF3S0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9uZ29kYiwgeyBPYmplY3RJRCB9IGZyb20gJ21vbmdvZGInO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBNb25nb0NvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi91dGlscy9TZXJ2aWNlQ29uZic7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL3V0aWxzL0xvZ2dlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vbmdvREIge1xuICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyO1xuICBwcml2YXRlIGNvbmY6IE1vbmdvQ29uZmlndXJhdGlvbjtcblxuICBwcml2YXRlIHNhZmVEYXRhOiBib29sZWFuO1xuXG4gIHByaXZhdGUgY2xpZW50PzogbW9uZ29kYi5Nb25nb0NsaWVudDtcbiAgcHJpdmF0ZSBkYj86IG1vbmdvZGIuRGI7XG5cbiAgY29uc3RydWN0b3IoY29uZjogTW9uZ29Db25maWd1cmF0aW9uLCBsb2dnZXI6IExvZ2dlcikge1xuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICAgIHRoaXMuY29uZiA9IGNvbmY7XG4gICAgdGhpcy5zYWZlRGF0YSA9IHRydWU7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbW9uZ29PcHRzOiBtb25nb2RiLk1vbmdvQ2xpZW50T3B0aW9ucyA9IHtcbiAgICAgICAgYXV0aDogdGhpcy5jb25mLmF1dGgsXG4gICAgICAgIGF1dGhTb3VyY2U6IHRoaXMuY29uZi5kYk5hbWUsXG4gICAgICAgIGtlZXBBbGl2ZTogdHJ1ZSxcbiAgICAgICAgdXNlTmV3VXJsUGFyc2VyOiB0cnVlLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHVybCA9IGAke3RoaXMuY29uZi51cmx9OiR7dGhpcy5jb25mLnBvcnR9YDtcblxuICAgICAgdGhpcy5jbGllbnQgPSBhd2FpdCBtb25nb2RiLk1vbmdvQ2xpZW50LmNvbm5lY3QodXJsLCBtb25nb09wdHMpO1xuICAgICAgdGhpcy5kYiA9IHRoaXMuY2xpZW50LmRiKHRoaXMuY29uZi5kYk5hbWUpO1xuXG4gICAgICB0aGlzLmxvZ2dlci5vaygnTW9uZ29EQiBpbml0aWFsaXplZC4uLicpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcignTW9uZ29EQiBmYWlsZWQ6ICcsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGNsb3NlKCkge1xuICAgIHJldHVybiB0aGlzLmNsaWVudCAmJiBhd2FpdCB0aGlzLmNsaWVudC5jbG9zZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXREQkluc3RhbmNlKHJldHJ5ID0gZmFsc2UpOiBQcm9taXNlPG1vbmdvZGIuRGI+IHtcbiAgICBpZiAodGhpcy5kYikge1xuICAgICAgcmV0dXJuIHRoaXMuZGI7XG4gICAgfVxuICAgIGlmICghcmV0cnkpIHtcbiAgICAgIGF3YWl0IHRoaXMuaW5pdCgpO1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0REJJbnN0YW5jZSh0cnVlKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY29ubmVjdC4nKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2V0Q2xpZW50SW5zdGFuY2UoKTogUHJvbWlzZTxtb25nb2RiLk1vbmdvQ2xpZW50PiB7XG4gICAgaWYgKHRoaXMuY2xpZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5jbGllbnQ7XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuaW5pdCgpO1xuICAgIHJldHVybiB0aGlzLmdldENsaWVudEluc3RhbmNlKCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaXNDb25uZWN0ZWQoKSB7XG4gICAgY29uc3QgY2xpZW50OiBtb25nb2RiLk1vbmdvQ2xpZW50ID0gYXdhaXQgdGhpcy5nZXRDbGllbnRJbnN0YW5jZSgpO1xuICAgIHJldHVybiBjbGllbnQuaXNDb25uZWN0ZWQoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBmaW5kRG9jdW1lbnRCeUlkKGNvbGxlY3Rpb246IHN0cmluZywgaWQ6IHN0cmluZyB8IG51bWJlcik6IFByb21pc2U8YW55IHwgbnVsbD4ge1xuICAgIGNvbnN0IGRiOiBtb25nb2RiLkRiID0gYXdhaXQgdGhpcy5nZXREQkluc3RhbmNlKCk7XG5cbiAgICBjb25zdCBjb2xsID0gZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKTtcbiAgICAvLyBGaW5kIHNvbWUgZG9jdW1lbnRzXG4gICAgY29uc3QgZG9jID0gYXdhaXQgY29sbC5maW5kT25lKHsgX2lkOiBuZXcgT2JqZWN0SUQoaWQpIH0pO1xuICAgIHJldHVybiB0aGlzLnRyYW5zc2Zvcm1EYXRhKGRvYyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZmluZEFsbERvY3VtZW50cyhjb2xsZWN0aW9uOiBzdHJpbmcpOiBQcm9taXNlPGFueVtdPiB7XG4gICAgY29uc3QgZGI6IG1vbmdvZGIuRGIgPSBhd2FpdCB0aGlzLmdldERCSW5zdGFuY2UoKTtcblxuICAgIGNvbnN0IGNvbGwgPSBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pO1xuICAgIC8vIEZpbmQgc29tZSBkb2N1bWVudHNcbiAgICBjb25zdCBkb2NzID0gYXdhaXQgY29sbC5maW5kKHt9KS50b0FycmF5KCk7XG5cbiAgICByZXR1cm4gdGhpcy50cmFuc3Nmb3JtRGF0YShkb2NzIHx8IFtdKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBmaW5kQWxsRG9jdW1lbnRzQnlRdWVyeShjb2xsZWN0aW9uOiBzdHJpbmcsIHF1ZXJ5OiBhbnkpOiBQcm9taXNlPGFueVtdPiB7XG4gICAgY29uc3QgZGI6IG1vbmdvZGIuRGIgPSBhd2FpdCB0aGlzLmdldERCSW5zdGFuY2UoKTtcblxuICAgIGNvbnN0IGNvbGwgPSBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pO1xuICAgIC8vIEZpbmQgc29tZSBkb2N1bWVudHNcbiAgICBjb25zdCBkb2NzID0gYXdhaXQgY29sbC5maW5kKHF1ZXJ5KS50b0FycmF5KCk7XG5cbiAgICByZXR1cm4gdGhpcy50cmFuc3Nmb3JtRGF0YShkb2NzIHx8IFtdKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB1cGRhdGVEb2N1bWVudChjb2xsZWN0aW9uOiBzdHJpbmcsIHF1ZXJ5OiBhbnksIGRhdGE6IGFueSk6IFByb21pc2U8YW55W10+IHtcbiAgICBjb25zdCBkYjogbW9uZ29kYi5EYiA9IGF3YWl0IHRoaXMuZ2V0REJJbnN0YW5jZSgpO1xuXG4gICAgY29uc3QgY29sbCA9IGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbik7XG5cbiAgICBhd2FpdCBjb2xsLnVwZGF0ZU9uZShxdWVyeSwgeyAkc2V0OiBkYXRhIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZmluZEFsbERvY3VtZW50c0J5UXVlcnkoY29sbGVjdGlvbiwgcXVlcnkpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHVwZGF0ZURvY3VtZW50QnlJZChjb2xsZWN0aW9uOiBzdHJpbmcsIGlkOiBzdHJpbmcgfCBudW1iZXIsIGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgZGI6IG1vbmdvZGIuRGIgPSBhd2FpdCB0aGlzLmdldERCSW5zdGFuY2UoKTtcblxuICAgIGNvbnN0IGNvbGwgPSBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pO1xuXG4gICAgYXdhaXQgY29sbC51cGRhdGVPbmUoeyBfaWQ6IG5ldyBPYmplY3RJRChpZCkgfSwgeyAkc2V0OiBfLm9taXQoZGF0YSwgJ19pZCcpIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZmluZERvY3VtZW50QnlJZChjb2xsZWN0aW9uLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5zZXJ0RG9jdW1lbnQoY29sbGVjdGlvbjogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBkYjogbW9uZ29kYi5EYiA9IGF3YWl0IHRoaXMuZ2V0REJJbnN0YW5jZSgpO1xuXG4gICAgY29uc3QgY29sbCA9IGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbik7XG5cbiAgICBpZiAoXy5oYXMoZGF0YSwgJ19pZCcpKSB7XG4gICAgICBkYXRhLl9pZCA9IG5ldyBPYmplY3RJRChkYXRhLl9pZCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY29sbC5pbnNlcnRPbmUoZGF0YSk7XG5cbiAgICByZXR1cm4gdGhpcy50cmFuc3Nmb3JtRGF0YShyZXN1bHQub3BzWzBdKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpbnNlcnREb2N1bWVudHMoY29sbGVjdGlvbjogc3RyaW5nLCBkYXRhOiBhbnlbXSkge1xuICAgIGNvbnN0IGRiOiBtb25nb2RiLkRiID0gYXdhaXQgdGhpcy5nZXREQkluc3RhbmNlKCk7XG5cbiAgICBjb25zdCBjb2xsID0gZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbGwuaW5zZXJ0TWFueShkYXRhKTtcblxuICAgIHJldHVybiB0aGlzLnRyYW5zc2Zvcm1EYXRhKHJlc3VsdC5vcHMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGRlbGV0ZURvY3VtZW50KGNvbGxlY3Rpb246IHN0cmluZywgcXVlcnk6IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGRiOiBtb25nb2RiLkRiID0gYXdhaXQgdGhpcy5nZXREQkluc3RhbmNlKCk7XG5cbiAgICBjb25zdCBjb2xsID0gZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKTtcblxuICAgIGF3YWl0IGNvbGwuZGVsZXRlT25lKHF1ZXJ5KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkZWxldGVEb2N1bWVudHMoY29sbGVjdGlvbjogc3RyaW5nLCBxdWVyeTogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZGI6IG1vbmdvZGIuRGIgPSBhd2FpdCB0aGlzLmdldERCSW5zdGFuY2UoKTtcblxuICAgIGNvbnN0IGNvbGwgPSBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pO1xuXG4gICAgYXdhaXQgY29sbC5kZWxldGVNYW55KHF1ZXJ5KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkcm9wQ29sbGVjdGlvbihjb2xsZWN0aW9uOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYjogbW9uZ29kYi5EYiA9IGF3YWl0IHRoaXMuZ2V0REJJbnN0YW5jZSgpO1xuXG4gICAgYXdhaXQgZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKS5kcm9wKCk7XG4gIH1cblxuICBwcml2YXRlIHRyYW5zc2Zvcm1EYXRhKGRhdGE6IGFueSkge1xuICAgIGlmICh0aGlzLnNhZmVEYXRhKSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG59XG4iXX0=