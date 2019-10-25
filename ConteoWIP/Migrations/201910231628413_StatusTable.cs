namespace ConteoWIP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class StatusTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Status",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        AreaLine = c.String(),
                        CountType = c.String(),
                        Finish = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Status");
        }
    }
}
