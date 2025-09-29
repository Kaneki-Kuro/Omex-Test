import discord
from discord.ext import commands
from github import Github
import os

# ----- Discord Bot -----
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

# ----- GitHub Setup -----
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")  # Create a Personal Access Token
REPO_NAME = "username/discord-bot-data"      # Replace with your repo

g = Github(GITHUB_TOKEN)
repo = g.get_repo(REPO_NAME)

def read_file(path):
    file = repo.get_contents(path)
    return file.decoded_content.decode()

def write_file(path, content, message="Update via bot"):
    try:
        file = repo.get_contents(path)
        repo.update_file(file.path, message, content, file.sha)
    except:
        repo.create_file(path, message, content)

# ----- Events -----
@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")

@bot.command()
async def hello(ctx):
    await ctx.send(f"Hello {ctx.author.mention}!")

@bot.command()
async def write(ctx, filename, *, content):
    write_file(filename, content)
    await ctx.send(f"Saved `{filename}` to GitHub!")

@bot.command()
async def read(ctx, filename):
    try:
        data = read_file(filename)
        await ctx.send(f"Content of `{filename}`:\n```{data}```")
    except:
        await ctx.send("File not found in GitHub.")

bot.run(os.environ.get("BOT_TOKEN"))
