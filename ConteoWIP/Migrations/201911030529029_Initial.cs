namespace ConteoWIP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Divisiones",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                        Clave1 = c.String(),
                        Clave2 = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UsuarioDivisiones",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Id_Usuario = c.Int(nullable: false),
                        Id_Division = c.Int(nullable: false),
                        Id_Sistema = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Divisiones", t => t.Id_Division, cascadeDelete: true)
                .ForeignKey("dbo.Sistemas", t => t.Id_Sistema, cascadeDelete: true)
                .ForeignKey("dbo.Usuarios", t => t.Id_Usuario, cascadeDelete: true)
                .Index(t => t.Id_Usuario)
                .Index(t => t.Id_Division)
                .Index(t => t.Id_Sistema);
            
            CreateTable(
                "dbo.Sistemas",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Roles",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                        Id_sistema = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Sistemas", t => t.Id_sistema, cascadeDelete: true)
                .Index(t => t.Id_sistema);
            
            CreateTable(
                "dbo.UsuarioRoles",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Id_Usuario = c.Int(nullable: false),
                        Id_Rol = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Roles", t => t.Id_Rol, cascadeDelete: true)
                .ForeignKey("dbo.Usuarios", t => t.Id_Usuario, cascadeDelete: true)
                .Index(t => t.Id_Usuario)
                .Index(t => t.Id_Rol);
            
            CreateTable(
                "dbo.Usuarios",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Usuario = c.String(),
                        Email = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.SistemaPantallas",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Id_sistema = c.Int(nullable: false),
                        Persona_Encargada = c.String(),
                        Descripcion = c.String(),
                        Ext = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Sistemas", t => t.Id_sistema, cascadeDelete: true)
                .Index(t => t.Id_sistema);
            
            DropTable("dbo.Counts");
            DropTable("dbo.FirstCountStatus");
            DropTable("dbo.ReCountStatus");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.ReCountStatus",
                c => new
                    {
                        AreaLine = c.String(nullable: false, maxLength: 128),
                        Finish = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AreaLine);
            
            CreateTable(
                "dbo.FirstCountStatus",
                c => new
                    {
                        AreaLine = c.String(nullable: false, maxLength: 128),
                        Finish = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AreaLine);
            
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
            
            DropForeignKey("dbo.UsuarioDivisiones", "Id_Usuario", "dbo.Usuarios");
            DropForeignKey("dbo.UsuarioDivisiones", "Id_Sistema", "dbo.Sistemas");
            DropForeignKey("dbo.SistemaPantallas", "Id_sistema", "dbo.Sistemas");
            DropForeignKey("dbo.UsuarioRoles", "Id_Usuario", "dbo.Usuarios");
            DropForeignKey("dbo.UsuarioRoles", "Id_Rol", "dbo.Roles");
            DropForeignKey("dbo.Roles", "Id_sistema", "dbo.Sistemas");
            DropForeignKey("dbo.UsuarioDivisiones", "Id_Division", "dbo.Divisiones");
            DropIndex("dbo.SistemaPantallas", new[] { "Id_sistema" });
            DropIndex("dbo.UsuarioRoles", new[] { "Id_Rol" });
            DropIndex("dbo.UsuarioRoles", new[] { "Id_Usuario" });
            DropIndex("dbo.Roles", new[] { "Id_sistema" });
            DropIndex("dbo.UsuarioDivisiones", new[] { "Id_Sistema" });
            DropIndex("dbo.UsuarioDivisiones", new[] { "Id_Division" });
            DropIndex("dbo.UsuarioDivisiones", new[] { "Id_Usuario" });
            DropTable("dbo.SistemaPantallas");
            DropTable("dbo.Usuarios");
            DropTable("dbo.UsuarioRoles");
            DropTable("dbo.Roles");
            DropTable("dbo.Sistemas");
            DropTable("dbo.UsuarioDivisiones");
            DropTable("dbo.Divisiones");
        }
    }
}
