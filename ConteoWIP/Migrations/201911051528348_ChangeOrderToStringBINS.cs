namespace ConteoWIP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeOrderToStringBINS : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.CountBINS", "OperationNumber", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.CountBINS", "OperationNumber", c => c.Int(nullable: false));
        }
    }
}
