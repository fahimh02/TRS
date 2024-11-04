// StyleMapperService.js
import axios from '../../api/axios';
import { CombinedData } from './Interfaces/Helper/CombinedData ';

class TRSService {
  static async saveStyleMapperInfo(newMappedData: CombinedData) {
    return await axios.post('/api/trs/stylemapperinfo', newMappedData);
  }

  static async updateStyleMapperInfo(id: number, newMappedData: CombinedData) {
    return await axios.put(`/api/trs/stylemapperinfo/${id}`, newMappedData);
  }
  static async fetchStyleMapperInfo(encryptedId: number | undefined) {
    return await axios.get(`/api/trs/stylemapperinfo/${encryptedId}`);
  }
}

export default TRSService;
 