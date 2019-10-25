namespace ConteoWIP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class StatusTables : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FirstCountStatus",
                c => new
                    {
                        AreaLine = c.String(nullable: false, maxLength: 128),
                        Finish = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AreaLine);
            
            CreateTable(
                "dbo.ReCountStatus",
                c => new
                    {
                        AreaLine = c.String(nullable: false, maxLength: 128),
                        Finish = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AreaLine);
            
            DropTable("dbo.Status");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.Status",
                c => new
                    {
                        AreaLine = c.String(nullable: false, maxLength: 128),
                        CountType = c.String(),
                        Finish = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AreaLine);
            
            DropTable("dbo.ReCountStatus");
            DropTable("dbo.FirstCountStatus");
        }
    }
}
