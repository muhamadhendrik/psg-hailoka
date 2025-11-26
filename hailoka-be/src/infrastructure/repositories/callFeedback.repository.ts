import { CallFeedback } from "../database/models/callFeedback.model";
import { Call } from "../database/models/call.model";
import { UserModel } from "../database/models/user.model";

export interface CallFeedbackEntity {
  id: string;
  callId: string;
  kind: "GUEST" | "USER";
  refId: string;
  score: number;
  feedback: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CallFeedbackRepository {
  async create(
    payload: Partial<CallFeedbackEntity>
  ): Promise<CallFeedbackEntity> {
    const feedback = await CallFeedback.create({
      call_id: payload.callId!,
      kind: payload.kind!,
      ref_id: payload.refId!,
      score: payload.score!,
      feedback: payload.feedback || null,
    } as any);

    return this.toEntity(feedback.toJSON());
  }

  async findByCallId(callId: string): Promise<CallFeedbackEntity[]> {
    const feedbacks = await CallFeedback.findAll({
      where: {
        call_id: callId,
      },
      include: [
        {
          model: Call,
          as: "call",
          attributes: ["id", "organization_id", "join_code", "direction"],
        },
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name", "email"],
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return feedbacks.map((feedback) => this.toEntity(feedback.toJSON()));
  }

  async findById(id: string): Promise<CallFeedbackEntity | null> {
    const feedback = await CallFeedback.findByPk(id, {
      include: [
        {
          model: Call,
          as: "call",
          attributes: ["id", "organization_id", "join_code", "direction"],
        },
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name", "email"],
          required: false,
        },
      ],
    });

    return feedback ? this.toEntity(feedback.toJSON()) : null;
  }

  async findByOrganizationId(
    organizationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<CallFeedbackEntity[]> {
    const feedbacks = await CallFeedback.findAll({
      include: [
        {
          model: Call,
          as: "call",
          where: {
            organization_id: organizationId,
          },
          attributes: ["id", "organization_id", "join_code", "direction"],
          required: true,
        },
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name", "email"],
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return feedbacks.map((feedback) => this.toEntity(feedback.toJSON()));
  }

  async update(
    id: string,
    updates: Partial<Pick<CallFeedbackEntity, "score" | "feedback">>
  ): Promise<CallFeedbackEntity> {
    const feedback = await CallFeedback.findByPk(id);
    if (!feedback) {
      throw new Error("Call feedback not found");
    }

    if (updates.score !== undefined) {
      feedback.score = updates.score;
    }
    if (updates.feedback !== undefined) {
      feedback.feedback = updates.feedback;
    }

    await feedback.save();
    return this.toEntity(feedback.toJSON());
  }

  private toEntity(raw: any): CallFeedbackEntity {
    return {
      id: raw.id,
      callId: raw.call_id,
      kind: raw.kind,
      refId: raw.ref_id,
      score: raw.score,
      feedback: raw.feedback,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }
}

