namespace ActivityWebsite.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAuthenticateType : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "authenticateType", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "authenticateType");
        }
    }
}
