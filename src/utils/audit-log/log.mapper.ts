import _ from "lodash";
import { VN_MAPS, VN_TIMESTAMP } from "./log.constant";
import dayjs from "@/utils/dayjs.config";

const logMapper = (data: any, entityName: string) => {
    if (data === null || typeof data !== 'object') return data;

    if (Array.isArray(data)) return data.map(item => logMapper(item, entityName));

    const translated: any = {};

    const entityKey = VN_MAPS[entityName] || entityName;
    for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined) continue;

        const newKey = _.capitalize(entityKey[key] || VN_TIMESTAMP[key] || key);

        if (value instanceof Date) {
            let format = 'HH:mm:ss DD/MM/YYYY';
            if (key === 'dayOfBirth') format = 'DD/MM/YYYY';
            translated[newKey] = dayjs(value).format(format);
        }
        else if (entityKey[key]) {
            const nestedEntity = VN_MAPS[key] ? key : entityName;
            translated[newKey] = logMapper(value, nestedEntity);
        }
        else {
            translated[newKey] = String(value)
        }
    }

    return translated;
}

export default logMapper