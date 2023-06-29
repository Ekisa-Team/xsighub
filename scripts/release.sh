#!/bin/bash

# Prompt for release type
read -rp "Enter release type (major, minor, patch): " release_type

# Validate release type
case $release_type in
major | minor | patch) ;;
*)
    echo "Invalid release type"
    exit 1
    ;;
esac

# Prompt for release scope
read -rp "Do you want to specify a release scope? (y/n): " prompt_scope

# Convert input to lowercase
prompt_scope=$(echo "$prompt_scope" | tr '[:upper:]' '[:lower:]')

# Validate release scope
case $prompt_scope in
y | yes)
    read -rp "Enter release scope (stable | beta | alpha): " release_scope

    # Convert input to lowercase
    release_scope=$(echo "$release_scope" | tr '[:upper:]' '[:lower:]')

    # Validate release scope input
    case $release_scope in
    stable | beta | alpha) ;;
    *)
        echo "Invalid release scope"
        exit 1
        ;;
    esac
    ;;
n | no)
    release_scope=""
    ;;
*)
    echo "Invalid choice"
    exit 1
    ;;
esac

# Read current version from package.json
version=$(awk -F'"' '/version/{print $4}' package.json)

# Determine new version
case $release_type in
major)
    new_version=$(echo "$version" | awk -F. -v OFS=. '{$1++; $2=0; $3=0} {print $0}')
    ;;
minor)
    new_version=$(echo "$version" | awk -F. -v OFS=. '{$2++; $3=0} {print $0}')
    ;;
patch)
    new_version=$(echo "$version" | awk -F. -v OFS=. '{$3++} {print $0}')
    ;;
esac

new_version_prefixed="v${new_version}"

# Append release scope (if any) to new version
if [ -n "$release_scope" ]; then
    new_version="${new_version}-${release_scope}"
fi

# Update root package.json with new version
sed -i "s/\"version\": \"$version\"/\"version\": \"$new_version\"/" "$(pwd)/package.json"
echo "Updated package.json with version $new_version"

# Loop through all package.json files in ./packages/ directory and update their version numbers
for package in ./packages/*/package.json; do
    # Read current version from package.json
    version=$(awk -F'"' '/version/{print $4}' "$package")

    # Update package.json with new version
    sed -i "s/\"version\": \"$version\"/\"version\": \"$new_version\"/" "$package"
    echo "Updated $package with version $new_version"
done

# Commit changes to package.json
git commit -m "release: bump version to $new_version" --no-verify .
echo "Commited changes to package.json"

# Push package.json changes
git push origin HEAD
echo "Pushed package.json changes"

# Create git tag with new version
git tag -a "$new_version_prefixed" -m "Release $new_version_prefixed"
echo "Created git tag $new_version_prefixed"

# Push git tag
git push origin "$new_version_prefixed"

# Deploy packages to NPM
pnpm --filter core release
pnpm --filter sdk release

echo "Pushed git tag $new_version_prefixed. Check https://github.com/Ekisa-Team/xsighub/actions to follow up the active workflow."
