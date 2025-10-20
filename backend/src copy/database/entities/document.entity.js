const { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } = require('typeorm');

@Entity('documents')
class Document {
    @PrimaryGeneratedColumn('uuid')
    id;

    @Column()
    source;

    @Column()
    type; // 'penetration_report', 'attack_log', 'regulation'

    @Column({ nullable: true })
    batchId;

    @Column('text')
    originalText;

    @Column('text')
    hash;

    @Column('jsonb', { nullable: true })
    metadata; // 攻擊向量、run_id、模型版本等

    @CreateDateColumn()
    createdAt;

    @OneToMany(() => require('./chunk.entity').Chunk, chunk => chunk.document)
    chunks;
}

module.exports = { Document };
