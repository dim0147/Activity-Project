namespace ActivityWebsite.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EditAddStatus : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AspNetUsers", "status", c => c.String(defaultValue: "normal"));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AspNetUsers", "status", c => c.String(nullable: false));
        }
    }
}
