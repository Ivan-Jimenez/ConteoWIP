namespace ConteoWIP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Counts",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        OrderNumber = c.Int(nullable: false),
                        Product = c.String(nullable: false),
                        Alias = c.String(),
                        ProductName = c.String(),
                        AreaLine = c.String(nullable: false),
                        OperationNumber = c.Int(nullable: false),
                        OperationDescription = c.String(),
                        OrdQty = c.Int(nullable: false),
                        Physical1 = c.Int(),
                        Result = c.Int(),
                        Comments = c.String(),
                        ReCount = c.Int(),
                        FinalResult = c.Int(),
                        Status = c.String(),
                        ConciliationUser = c.String(),
                        StdCost = c.Decimal(nullable: false, storeType: "money"),
                        TotalCost = c.Decimal(storeType: "money"),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.CountBINS",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        OrderNumber = c.Int(nullable: false),
                        Product = c.String(nullable: false),
                        Alias = c.String(),
                        ProductName = c.String(),
                        AreaLine = c.String(nullable: false),
                        OperationNumber = c.Int(nullable: false),
                        OperationDescription = c.String(),
                        OrdQty = c.Int(nullable: false),
                        Physical1 = c.Int(),
                        Result = c.Int(),
                        Comments = c.String(),
                        ReCount = c.Int(),
                        FinalResult = c.Int(),
                        Status = c.String(),
                        ConciliationUser = c.String(),
                        StdCost = c.Decimal(nullable: false, storeType: "money"),
                        TotalCost = c.Decimal(storeType: "money"),
                    })
                .PrimaryKey(t => t.ID);
            
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
            
        }
        
        public override void Down()
        {
            DropTable("dbo.ReCountStatus");
            DropTable("dbo.FirstCountStatus");
            DropTable("dbo.CountBINS");
            DropTable("dbo.Counts");
        }
    }
}
