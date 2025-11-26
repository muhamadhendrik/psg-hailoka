import { CallParticipant, CallEvent, Call, UserModel, Extension } from "../database/models";

export class CallDashboardRepository {

  async getCurrentCallOverview(orgId: string) {

    // const call = await Call.findAll({
    //     include: [{ model: Extension, as: "extension" }],
    // });

    // // console.log("call >>> ", call);
    // return call

    // const participant = await CallParticipant.findOne({
    // include: [
    //     {
    //         model: Call,
    //         as: "call",
    //         include: [
    //             { model: Extension, as: "extension", attributes: ["id", "name"] },
    //         ],
    //     },
    // ],
    // });

    // console.log(JSON.stringify(participant, null, 2));


    const participants = await CallParticipant.findAll({
    where: { role: "host" },
    include: [
        {
        model: Call,
        as: "call",
        where: { organization_id: orgId },
        attributes: ["id"], // ✅ exclude all call fields
        required: true,
        include: [
            {
            model: Extension,
            as: "extension",
            attributes: ["id", "name"], // only what you need
            },
        ],
        },
        {
        model: CallEvent,
        as: "events",
        attributes: ["id", "event_type", "created_at"],
        separate: true,
        order: [["created_at", "ASC"]],
        },
        {
        model: UserModel,
        as: "user",
        attributes: ["id", "name"],
        required: false,
        },
    ],
    });

    // ✅ Type assertion ensures p.events is recognized

    const results = participants.map((p: CallParticipant & { events?: CallEvent[] }) => {
    const events = p.events ?? [];
    if (events.length === 0) return { ...p.toJSON(), duration: null };

    const lastEvent = events[events.length - 1];
    const answeredEvent = events.find((e) => e.event_type === "answered");

    let duration: number | null = null;

    if (lastEvent?.event_type === "answered") {
        // just return the time it was answered
        duration = new Date(lastEvent.created_at).getTime();
    } else if (
        ["hold", "ended"].includes(lastEvent?.event_type || "") &&
        answeredEvent
    ) {
        const diffMs =
        new Date(lastEvent?.created_at || "").getTime() -
        new Date(answeredEvent.created_at).getTime();
        duration = Math.floor(diffMs / 1000); // seconds
    }

    return {
        ...p.toJSON(),
        duration,
        last_event_type: lastEvent?.event_type,
    };
    });

    return results;
  }
}
