import { CallRepository, CreateCallDTO } from "../../../infrastructure/repositories/call.repository";
import { CreateCallParticipantDTO } from "../../../infrastructure/repositories/callParticipant.repository";
import { CallStaffAvailibilityRepository } from "../../../infrastructure/repositories/callStaffAvailibility.repository";
import { CallParticipantRepository } from "../../../infrastructure/repositories/callParticipant.repository";
import { CreateCallEventDTO } from "../../../infrastructure/repositories/callEvent.repository";
import { CallEventRepository } from "../../../infrastructure/repositories/callEvent.repository";


export class CreateCallUsecase {

    constructor( 
        private callRepo: CallRepository,
        private staffAvailRepo: CallStaffAvailibilityRepository,
        private callParticipantRepo: CallParticipantRepository,
        private callEventRepo: CallEventRepository
    ){}

    async execute(data: any) {
        

        // #1. Insert Ke CallRepository

        const callInsert:  CreateCallDTO = {
            organization_id: data.organization_id,
            join_code: "",
            direction: "inbound"        
        };

        const call = await this.callRepo.create(callInsert)

        // console.log("Inserted Call id >>> ", call?.id);
        // console.log("Inserted Call join code >>> ", call?.join_code);
    
        // #2. Insert Ke Call Participant

        const guestParticipant: CreateCallParticipantDTO = {
            call_id: call?.id || "",
            role: "caller",
            kind: "guest",
            ref_id: data.guest_user_id
        }

        const extParticipant: CreateCallParticipantDTO = {
            call_id: call?.id || "",
            role: "recipient",
            kind: "extension",
            ref_id: data.extension_id || ""
        }

        const staffAvailable = await  this.staffAvailRepo.getAvailablestaff( data.extension_id )

        // console.log("staffAvailable user_id >> ", staffAvailable?.user_id);
        // console.log("staffAvailable name  >> ", staffAvailable?.user?.name)

        const staffParticipant: CreateCallParticipantDTO = {
            call_id: call?.id || "",
            role: "host",
            kind: "user",
            ref_id: staffAvailable?.user_id || ""
        }

        await this.callParticipantRepo.create(guestParticipant)
        await this.callParticipantRepo.create(extParticipant)
        const staffParticipantInserted  = await this.callParticipantRepo.create(staffParticipant)
        

        // #3. Insert Ke call Event

        // Call Event Created

        const callEventCreated: CreateCallEventDTO = {
            call_id: call?.id || "",
            call_participant_id: null,
            attempt_count: 1,
            event_type: "created",
            queue_count: 0
        }

        const callEventRinging: CreateCallEventDTO = {
            call_id: call?.id || "",
            call_participant_id: staffParticipantInserted.id,
            attempt_count: 1,
            event_type: "ringing",
            queue_count: 0
        }

        await this.callEventRepo.create(callEventCreated)

        await this.callEventRepo.create(callEventRinging)


    }

}   
