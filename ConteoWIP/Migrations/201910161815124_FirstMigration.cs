namespace ConteoWIP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FirstMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Counts",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Product = c.String(nullable: false),
                        Alias = c.String(nullable: false),
                        ProductName = c.String(),
                        AreaLine = c.String(nullable: false),
                        OperationNumber = c.Int(nullable: false),
                        OperationDescription = c.String(),
                        OrderNumber = c.Int(nullable: false),
                        OrdQty = c.Int(nullable: false),
                        Physical1 = c.Int(nullable: false),
                        Result = c.Int(nullable: false),
                        Comments = c.String(),
                        ReCount = c.Int(nullable: false),
                        FinalResult = c.Int(nullable: false),
                        Status = c.String(),
                        ConciliationUser = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Counts");
        }
    }
}
