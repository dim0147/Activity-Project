namespace ActivityWebsite.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddStatus : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "status", c => c.String(nullable: false, defaultValue: "normal"));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "status");
        }
    }
}
