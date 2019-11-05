namespace ConteoWIP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Fix1 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.CountBINS", "OrderNumber", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.CountBINS", "OrderNumber", c => c.Int(nullable: false));
        }
    }
}
