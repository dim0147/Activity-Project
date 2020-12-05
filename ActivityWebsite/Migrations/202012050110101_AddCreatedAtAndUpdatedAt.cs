namespace ActivityWebsite.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCreatedAtAndUpdatedAt : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "UpdatedAt", c => c.DateTime(nullable: false, defaultValueSql: "GETDATE()"));
            AlterColumn("dbo.AspNetUsers", "CreatedAt", c => c.DateTime(nullable: false, defaultValueSql: "GETDATE()"));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AspNetUsers", "CreatedAt", c => c.DateTime(nullable: false));
            DropColumn("dbo.AspNetUsers", "UpdatedAt");
        }
    }
}
