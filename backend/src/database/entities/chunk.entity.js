const { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } = require('typeorm');

@Entity('chunks')
class Chunk {
    @PrimaryGeneratedColumn('uuid')
    id;

    @Column('uuid')
    documentId;

    @Column()
    chunkIndex;

    @Column('text')
    text;

    @Column('vector', { nullable: true })
    embedding; // pgvector 類型

    @Column('jsonb', { nullable: true })
    metadata;

    @ManyToOne(() => require('./document.entity').Document, document => document.chunks)
    @JoinColumn({ name: 'documentId' })
    document;
}

module.exports = { Chunk };
