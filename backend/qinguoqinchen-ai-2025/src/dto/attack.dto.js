import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExecuteAttackDto {
  @ApiProperty({
    description: '要執行的攻擊向量 ID 陣列',
    example: ['A1', 'A2', 'A3'],
    type: [String],
    enum: ['A1', 'A2', 'A3', 'A4', 'A5'],
  })
  vectorIds;

  @ApiPropertyOptional({
    description: '目標圖像 (Base64 編碼)',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...',
    type: String,
  })
  targetImage;

  @ApiPropertyOptional({
    description: '攻擊強度設定',
    example: 'medium',
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  intensity;

  @ApiPropertyOptional({
    description: '是否存儲測試結果到 RAG 系統',
    example: true,
    type: Boolean,
    default: true,
  })
  storeResults;
}

export class ComboAttackDto {
  @ApiProperty({
    description: '複合攻擊組合陣列',
    example: [['A1', 'A2'], ['A3', 'A4'], ['A2', 'A3', 'A5']],
    type: [[String]],
  })
  combos;

  @ApiPropertyOptional({
    description: '攻擊強度設定',
    example: 'high',
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  intensity;

  @ApiPropertyOptional({
    description: '執行間隔 (毫秒)',
    example: 2000,
    type: Number,
    default: 1000,
  })
  interval;
}

export class RagSearchDto {
  @ApiProperty({
    description: '搜尋查詢字串',
    example: 'StyleGAN3 人臉偽造攻擊 eKYC 繞過',
    type: String,
  })
  query;

  @ApiPropertyOptional({
    description: '返回結果數量限制',
    example: 5,
    type: Number,
    default: 5,
    minimum: 1,
    maximum: 20,
  })
  limit;

  @ApiPropertyOptional({
    description: '相似度閾值 (0-1)',
    example: 0.7,
    type: Number,
    default: 0.7,
    minimum: 0,
    maximum: 1,
  })
  threshold;

  @ApiPropertyOptional({
    description: '搜尋類別過濾',
    example: 'eKYC_PENETRATION',
    enum: ['eKYC_PENETRATION', 'FACE_RECOGNITION', 'DOCUMENT_VERIFICATION'],
  })
  category;
}

export class DefenseStrategyDto {
  @ApiProperty({
    description: '攻擊測試數據',
    type: Object,
    example: {
      attackId: 'QQC_ATK_1696614000_ABC123',
      vectors: ['A1', 'A3'],
      results: [
        {
          vectorId: 'A1',
          model: 'StyleGAN3',
          success: true,
          confidence: 0.85,
          bypassScore: 0.78
        }
      ],
      overallBypass: true
    }
  })
  attackData;

  @ApiPropertyOptional({
    description: '環境上下文數據',
    type: Object,
    example: {
      environment: 'production',
      industry: 'banking',
      complianceRequirements: ['ISO27001', 'PCI-DSS']
    }
  })
  contextData;
}
