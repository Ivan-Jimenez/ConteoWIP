namespace ConteoWIP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FixKeyCounts : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("dbo.Counts");
            AlterColumn("dbo.Counts", "OrderNumber", c => c.Int(nullable: false, identity: true));
            AddPrimaryKey("dbo.Counts", "OrderNumber");
            DropColumn("dbo.Counts", "ID");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Counts", "ID", c => c.Int(nullable: false, identity: true));
            DropPrimaryKey("dbo.Counts");
            AlterColumn("dbo.Counts", "OrderNumber", c => c.Int(nullable: false));
            AddPrimaryKey("dbo.Counts", "ID");
        }
    }
}
