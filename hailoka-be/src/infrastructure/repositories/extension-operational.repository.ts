import { Transaction } from "sequelize";
import { ExtensionOperationalHour } from "../database/models/extensionOperationalHour.model";

export type HoursDto = {
  day_of_week: number;
  start_time: string; 
  end_time: string
};

export class ExtensionOperationalRepository {
    /**
   * Replace operational hours for an extension:
   * 1) Delete existing rows for the extension_id
   * 2) Bulk insert provided hours
   * Returns array of inserted ids (empty array if none inserted)
   */
  async replaceOperationalHours( 

    extension_id: string, hours: Array<HoursDto>, options?: { transaction?: Transaction }

  ): Promise<number[]> {
    
    // Delete existing records for the extension
    await ExtensionOperationalHour.destroy({
      where: { extension_id },
      ...(options?.transaction ? { transaction: options.transaction } : {}),
    });

    if (!hours || hours.length === 0) return [];

    const payload = hours.map((h) => ({
      extension_id,
      day_of_week: h.day_of_week,
      start_time: h.start_time,
      end_time: h.end_time,
    }));

    const created = await ExtensionOperationalHour.bulkCreate(payload, {
      returning: true,
      ...(options?.transaction ? { transaction: options.transaction } : {}),
    });

    return created.map((c) => c.id);
  }

  async deleteByExtension(id: string) {
      return ExtensionOperationalHour.destroy({
        where:{ extension_id: id }
      });
  }
  
}