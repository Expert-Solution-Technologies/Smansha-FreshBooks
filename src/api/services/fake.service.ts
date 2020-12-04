export class FakeService {

    /**
     * get all records
     */
    async getAllRecords() {
        return new Promise(async (resolve, reject) => {
            try {
                const records: any = [];
                resolve(records);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     *  will delete the entity
     * @param entityId  pass the entityid for delete
     */
    async deleteRecord(entityId: string) {
        return new Promise(async (resolve, reject) => {
            try {
                // to do write logic
                resolve(true);
            } catch (err) {
                reject(err);
            }

        });
    }

    /**
     * will update the record
     * @param entityId pass the entityId for update
     */
    async updateRecord(entity: any) {
        return new Promise(async (resolve, reject) => {
            try {
                // to do write logic for update
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     *  pass the entity for save
     * @param entity pass the entity
     */
    async createRecord(entity: any) {
        return new Promise(async (resolve, reject) => {
            try {
                // to do write logic here for add
                resolve(entity);
            } catch (err) {
                reject(err);
            }

        });
    }

}