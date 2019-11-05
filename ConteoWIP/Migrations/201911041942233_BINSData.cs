namespace ConteoWIP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class BINSData : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FirstCountStatusBINS",
                c => new
                    {
                        AreaLine = c.String(nullable: false, maxLength: 128),
                        Finish = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AreaLine);
            
            CreateTable(
                "dbo.ReCountStatusBINS",
                c => new
                    {
                        AreaLine = c.String(nullable: false, maxLength: 128),
                        Finish = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AreaLine);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.ReCountStatusBINS");
            DropTable("dbo.FirstCountStatusBINS");
        }
    }
}
