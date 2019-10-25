namespace ConteoWIP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EstatusTable : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("dbo.Status");
            AlterColumn("dbo.Status", "AreaLine", c => c.String(nullable: false, maxLength: 128));
            AddPrimaryKey("dbo.Status", "AreaLine");
            DropColumn("dbo.Status", "ID");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Status", "ID", c => c.Int(nullable: false, identity: true));
            DropPrimaryKey("dbo.Status");
            AlterColumn("dbo.Status", "AreaLine", c => c.String());
            AddPrimaryKey("dbo.Status", "ID");
        }
    }
}
