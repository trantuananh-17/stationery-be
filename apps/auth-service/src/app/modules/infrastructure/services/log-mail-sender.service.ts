import { Injectable, Logger } from '@nestjs/common';

import { IMailSender } from '../../application/ports/services/mail.port';

/**
 * Adapter tạm: in link đặt lại mật khẩu ra log thay vì gửi email thật.
 *
 * Dự án chưa có thư viện gửi mail nào (nodemailer/SMTP) nên chưa gửi được thật.
 * Khi có, chỉ cần thêm một adapter khác implement IMailSender rồi đổi
 * useClass trong auth-infrs.module.ts — phần còn lại không phải sửa.
 */
@Injectable()
export class LogMailSender implements IMailSender {
  async sendPasswordReset(input: {
    email: string;
    resetUrl: string;
    expiresInMinutes: number;
  }): Promise<void> {
    Logger.log(
      `[MAIL] Đặt lại mật khẩu cho ${input.email} — link (hết hạn sau ${input.expiresInMinutes} phút): ${input.resetUrl}`,
      'LogMailSender',
    );
  }
}
