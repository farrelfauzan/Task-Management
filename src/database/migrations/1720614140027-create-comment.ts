import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateComment1720614140027 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {



        await queryRunner.createTable(
            new Table({
                name: 'comment',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                        default: `uuid_generate_v4()`,
                    },
                    {
                        name: 'content',
                        type: 'text',
                    },
                    {
                        name: 'userId',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'taskId',
                        type: 'uuid',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'comment',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'comment',
            new TableForeignKey({
                columnNames: ['taskId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'task',
                onDelete: 'CASCADE',
            }),
        );


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const commentTable = await queryRunner.getTable('comment');
        const commentUserForeignKey = commentTable.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('userId') !== -1,
        );
        const commentTaskForeignKey = commentTable.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('taskId') !== -1,
        );

        await queryRunner.dropForeignKey('comment', commentUserForeignKey);
        await queryRunner.dropForeignKey('comment', commentTaskForeignKey);

        await queryRunner.dropTable('comment');
    }
}

