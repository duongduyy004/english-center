import { VN_MAPS } from "./log.constant";

const logMapper = (data: any, entityName: string) => {
    if (data === null || typeof data !== 'object') return data;

    if (Array.isArray(data)) return data.map(item => logMapper(item, entityName));

    const translated: any = {};

    const entityKey = VN_MAPS[entityName] || entityName;
    for (const [key, value] of Object.entries(data)) {
        const newKey = entityKey[key] || key;
        if (entityKey[key]) {
            const nestedEntity = VN_MAPS[key] ? key : entityName;
            translated[newKey] = logMapper(value, nestedEntity);
        }
        else {
            translated[newKey] = value;
        }
    }
    return translated;
}

export default logMapper